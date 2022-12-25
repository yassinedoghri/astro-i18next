import ts from "typescript";

/**
 * Traverse ts' AST to inject i18next's language switch
 * @param context
 * @returns
 */
export const transformer: ts.TransformerFactory<ts.SourceFile> =
  (context: ts.TransformationContext) => (rootNode) => {
    const { factory, getCompilerOptions } = context;
    let doesI18nextImportExist = false;

    const { locale } = getCompilerOptions();

    function visit(node: ts.Node): ts.Node {
      // isolate i18next import statement
      if (
        ts.isImportDeclaration(node) &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        node.moduleSpecifier.text === "i18next" &&
        ts.isImportClause(node.importClause)
      ) {
        doesI18nextImportExist = true;

        if (!node.importClause.namedBindings) {
          return factory.updateImportDeclaration(
            node,
            node.modifiers,
            factory.createImportClause(
              node.importClause.isTypeOnly,
              node.importClause.name,
              factory.createNamedImports([
                factory.createImportSpecifier(
                  false,
                  undefined,
                  factory.createIdentifier("changeLanguage")
                ),
              ])
            ),
            node.moduleSpecifier,
            node.assertClause
          );
        }

        if (
          ts.isImportClause(node.importClause) &&
          ts.isNamedImports(node.importClause.namedBindings) &&
          !node.importClause.namedBindings.elements.find(
            (namedImport) => namedImport.name.escapedText === "changeLanguage"
          )
        ) {
          // import changeLanguage function in i18next import declaration
          return factory.updateImportDeclaration(
            node,
            node.modifiers,
            factory.updateImportClause(
              node.importClause,
              false,
              node.importClause.name,
              factory.updateNamedImports(node.importClause.namedBindings, [
                ...node.importClause.namedBindings.elements,
                factory.createImportSpecifier(
                  false,
                  undefined,
                  factory.createIdentifier("changeLanguage")
                ),
              ])
            ),
            node.moduleSpecifier,
            node.assertClause
          );
        }

        return node;
      }

      // remove any occurrence of changeLanguage() call
      if (
        ts.isExpressionStatement(node) &&
        ts.isCallExpression(node.expression) &&
        ((ts.isPropertyAccessExpression(node.expression.expression) &&
          node.expression.expression.name.escapedText === "changeLanguage") ||
          (ts.isIdentifier(node.expression.expression) &&
            node.expression.expression.escapedText === "changeLanguage"))
      ) {
        return undefined;
      }

      return ts.visitEachChild(node, visit, context);
    }

    let visitedNode = ts.visitNode(rootNode, visit);

    const statements = [...visitedNode.statements];

    if (!doesI18nextImportExist) {
      statements.unshift(
        factory.createImportDeclaration(
          undefined,
          factory.createImportClause(
            false,
            undefined,
            factory.createNamedImports([
              factory.createImportSpecifier(
                false,
                undefined,
                factory.createIdentifier("changeLanguage")
              ),
            ])
          ),
          factory.createStringLiteral("i18next"),
          undefined
        )
      );
    }

    // append the changeLanguage statement after imports

    // get a boolean array with values telling whether or not a statement is an import
    const importDeclarationsMap = statements.map((statement) =>
      ts.isImportDeclaration(statement)
    );

    const lastIndexOfImportDeclaration =
      importDeclarationsMap.lastIndexOf(true);

    // insert changeLanguage statement after the imports
    // and surrounded by line breaks
    statements.splice(
      lastIndexOfImportDeclaration + 1,
      0,
      factory.createIdentifier("\n") as unknown as ts.Statement
    );
    statements.splice(
      lastIndexOfImportDeclaration + 1,
      0,
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createIdentifier("changeLanguage"),
          undefined,
          [factory.createStringLiteral(locale as string)]
        )
      )
    );
    statements.splice(
      lastIndexOfImportDeclaration + 1,
      0,
      factory.createIdentifier("\n") as unknown as ts.Statement
    );

    visitedNode = factory.updateSourceFile(
      visitedNode,
      statements,
      visitedNode.isDeclarationFile,
      visitedNode.referencedFiles,
      visitedNode.typeReferenceDirectives,
      visitedNode.hasNoDefaultLib,
      visitedNode.libReferenceDirectives
    );

    return visitedNode;
  };
