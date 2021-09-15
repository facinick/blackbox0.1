import { createInterface } from 'readline';

const readLine = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

export const questionAsync = ({ question }: { question: string }): Promise<string> => {
    return new Promise(resolve => {
        readLine.question(`input: [auth] ${question} > `, (answer: string) => {
            resolve(answer);
        });
    });
};
