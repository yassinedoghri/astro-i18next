import { useState, useEffect } from "react";
import "./Counter.css";
import { useTranslation } from "react-i18next";

export default function Counter({
  children,
  count: initialCount,
}: {
  children: Element;
  count: number;
}) {
  const { t } = useTranslation();
  const [count, setCount] = useState(initialCount);
  const add = () => setCount((i: number) => i + 1);
  const subtract = () => setCount((i: number) => i - 1);

  useEffect(() => {
    console.log(t("myCoolCounter"));
  }, [t]);

  return (
    <>
      <p>{t("myCoolCounter")}</p>
      <div className="counter">
        <button onClick={subtract}>-</button>
        <pre>{count}</pre>
        <button onClick={add}>+</button>
      </div>
      <div className="counter-message">{children}</div>
    </>
  );
}
