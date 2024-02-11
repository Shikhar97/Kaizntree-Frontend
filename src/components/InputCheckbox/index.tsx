import classNames from "classnames"
import { useRef } from "react"
import { InputCheckboxComponent } from "./types"

export const InputCheckbox: InputCheckboxComponent = ({ id, checked = false, disabled, onChange }) => {
    const { current: inputId } = useRef(`KaizntreeInputCheckbox-${id}`)
    // Bug 2 solved
    return (
        <div className="KaizntreeInputCheckbox--container" data-testid={inputId}>
            <input
                className={classNames("KaizntreeInputCheckbox--label", {
                    "KaizntreeInputCheckbox--label-checked": checked,
                    "KaizntreeInputCheckbox--label-disabled": disabled,
                })}
                id={inputId}
                type="checkbox"
                // className="KaizntreeInputCheckbox--input"
                checked={checked}
                disabled={disabled}
                onChange={() => onChange(!checked)}
            />
        </div>
    )
}