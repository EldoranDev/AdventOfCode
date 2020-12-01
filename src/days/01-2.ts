export default function (input: string[]) {
    const expenses = input.map((e) => Number(e));

    for (let i = 0; i < expenses.length; i++) {
        for (let j  = 0; j < expenses.length; j++) {
            for (let k = 0; k < expenses.length; k++) {
                if (expenses[i] + expenses[j] + expenses[k] === 2020) {
                    console.log(expenses[i]*expenses[j] * expenses[k]);
                    return;
                }
            }
        }
    }

};