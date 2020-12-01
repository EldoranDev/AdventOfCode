export default function (input: string[]) {
    const expenses = input.map((e) => Number(e));

    for (let i = 0; i < expenses.length; i++) {
        for (let j  = 0; j < expenses.length; j++) {
            if (expenses[i] + expenses[j] === 2020) {
                return expenses[i]*expenses[j];
            }
        }
    }

};