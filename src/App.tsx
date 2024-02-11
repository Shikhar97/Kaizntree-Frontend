import {Fragment, useCallback, useEffect, useMemo, useState} from "react"
import {InputSelect} from "./components/InputSelect"
import {Instructions} from "./components/Instructions"
import {Transactions} from "./components/Transactions"
import {useEmployees} from "./hooks/useEmployees"
import {usePaginatedTransactions} from "./hooks/usePaginatedTransactions"
import {useTransactionsByEmployee} from "./hooks/useTransactionsByEmployee"
import {EMPTY_EMPLOYEE} from "./utils/constants"
import {Employee} from "./utils/types"

export function App() {
    const {data: employees, ...employeeUtils} = useEmployees()
    const {data: paginatedTransactions, ...paginatedTransactionsUtils} = usePaginatedTransactions()
    const {data: transactionsByEmployee, ...transactionsByEmployeeUtils} = useTransactionsByEmployee()
    const [isLoading, setIsLoading] = useState(false)

    const transactions = useMemo(
        () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
        [paginatedTransactions, transactionsByEmployee]
    )

    const loadAllTransactions = useCallback(async () => {
        setIsLoading(true)
        transactionsByEmployeeUtils.invalidateData()

        await employeeUtils.fetchAll()
        // Bug 5 solved
        // Moved the setIsLoading up and putting it after employee load, it solves the part 1 and part 2 both
        setIsLoading(false)
        await paginatedTransactionsUtils.fetchAll()


    }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

    const loadTransactionsByEmployee = useCallback(
        async (employeeId: string) => {
            paginatedTransactionsUtils.invalidateData()
            await transactionsByEmployeeUtils.fetchById(employeeId)
        },
        [paginatedTransactionsUtils, transactionsByEmployeeUtils]
    )

    useEffect(() => {
        if (employees === null && !employeeUtils.loading) {
            loadAllTransactions()
        }
    }, [employeeUtils.loading, employees, loadAllTransactions])

    return (
        <Fragment>
            <main className="MainContainer">
                <Instructions/>

                <hr className="KaizntreeBreak--l"/>

                <InputSelect<Employee>
                    isLoading={isLoading}
                    defaultValue={EMPTY_EMPLOYEE}
                    items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
                    label="Filter by employee"
                    loadingLabel="Loading employees"
                    parseItem={(item) => ({
                        value: item.id,
                        label: `${item.firstName} ${item.lastName}`,
                    })}
                    onChange={async (newValue) => {
                        if (newValue === null) {
                            return
                        }
                        // Bug 3 solved
                        // Added if statement to check if id is "" load all employees
                        if (newValue.id === "") {
                            await loadAllTransactions()
                        } else {
                            await loadTransactionsByEmployee(newValue.id)
                        }
                    }}
                />

                <div className="KaizntreeBreak--l"/>

                <div className="KaizntreeGrid">
                    <Transactions transactions={transactions}/>

                    {paginatedTransactions?.nextPage != null && transactions !== null && (
                        // Bug 6 solved
                        // Added a check to show this button until the next page is not null, it fixes
                        // part 1 and part 2
                        <button
                            className="KaizntreeButton"
                            disabled={paginatedTransactionsUtils.loading}
                            onClick={async () => {
                                await loadAllTransactions()
                            }}
                        >
                            View More
                        </button>
                    )}
                </div>
            </main>
        </Fragment>
    )
}