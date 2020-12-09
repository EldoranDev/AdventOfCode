import provideInput from './provider/input';

export async function get(args) {
    await provideInput(args.year, args.day);
}