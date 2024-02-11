import { Fragment } from "react"

export function Instructions() {
  return (
    <Fragment>
      <h1 className="KaizntreeTextHeading--l">Approve transactions</h1>
      <div className="KaizntreeBreak--l" />
      <p className="KaizntreeText">
        Your company uses Kaizntree as their main financial instrument. You are a manager and you need to
        approve the transactions made by your employees.
        <span className="KaizntreeBreak--s" />
        Select the checkbox on the right to approve or decline the transactions. You can filter
        transactions by employee.
      </p>
    </Fragment>
  )
}
