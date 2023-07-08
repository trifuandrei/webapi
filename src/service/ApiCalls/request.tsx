const api_url = process.env.REACT_APP_API_URL
const requests = {
    fetchDeposits: 'https://localhost:7172/deposit/Get?operationTypeId=1',
    fetchWithdrawals: 'https://localhost:7172/withdrawal/Get?operationTypeId=2',
    fetchTradeOrder: 'https://localhost:7172/tradeorder/Get?operationTypeId=3',
    fetchOperationTypes: 'https://localhost:7172/OperationType/GetAll'
}
export default requests;