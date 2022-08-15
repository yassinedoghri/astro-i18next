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

    const { language } = getCompilerOptions();

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
            node.decorators,
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
            node.decorators,
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

    let statements: ts.NodeArray<ts.Statement> = factory.createNodeArray([
      ...visitedNode.statements,
      // append the changeLanguageStatement after a new line
      factory.createIdentifier("\n") as unknown as ts.Statement,
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createIdentifier("changeLanguage"),
          undefined,
          [factory.createStringLiteral(language as string)]
        )
      ),
    ]);

    if (!doesI18nextImportExist) {
      statements = factory.createNodeArray([
        factory.createImportDeclaration(
          undefined,
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
        ),
        ...statements,
      ]);
    }

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
