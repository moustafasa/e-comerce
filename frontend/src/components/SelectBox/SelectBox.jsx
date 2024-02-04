import { useEffect, useState } from "react";
import "./SelectBox.scss";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import classNames from "classnames";

/**
 * @param {options} param0 the options you need to be in select it should be like
    [
        { value: "test", text: "test" },
        { value: "test 2", text: "test 2" },
    ]
 * @param {valueState} param1 the state which will contain choosed value of select and the function * to set the value it should be like [selectValue,setSelect]
 * @returns customize select box
 */
const SelectBox = ({
  options,
  className,
  valueState: [selectValue, setSelectValue],
  name,
  disabled,
}) => {
  const [optOpenClass, setOptOpenClass] = useState(false);
  const optionsClass = classNames("options", { hidden: !optOpenClass });

  const chooseHandler = (e) => {
    setSelectValue(e.target.dataset.value);
    setOptOpenClass(false);
  };
  const openOptions = (e) => {
    e.stopPropagation();
    e.target.parentElement.click();
    setOptOpenClass(!optOpenClass);
  };
  useEffect(() => {
    const blurHandler = (e) => {
      if (!e.target.closest(".select-box")) {
        setOptOpenClass(false);
      }
    };
    document.addEventListener("click", blurHandler);
    return () => document.removeEventListener("click", blurHandler);
  }, []);
  return (
    <div className={`select-box ${className}`}>
      <div
        className="overlay"
        onClick={openOptions}
        role="select"
        style={{ pointerEvents: disabled && "none" }}
      >
        {optOpenClass ? (
          <FaCaretUp className="drop-down-icon" />
        ) : (
          <FaCaretDown className="drop-down-icon" />
        )}

        <select
          value={selectValue}
          onChange={(e) => setSelectValue(e.target.value)}
          name={name}
        >
          {options.map((opt, key) => (
            <option key={key} value={opt.value} disabled={opt.disabled}>
              {opt.text}
            </option>
          ))}
        </select>
      </div>
      <ul className={optionsClass}>
        {options.map((opt, key) => (
          <li
            key={key}
            onClick={chooseHandler}
            data-value={opt.value}
            className={`${
              opt.disabled
                ? "disabled"
                : selectValue === opt.value
                ? "active"
                : ""
            } `}
            aria-disabled={opt.disabled}
            role="option"
          >
            {opt.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectBox;
