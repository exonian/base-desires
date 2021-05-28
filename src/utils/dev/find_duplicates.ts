import { UntaggedWarscrolls } from "../../warscrolls/data";
import { listWarscrolls } from "../data";

const find_duplicates = () => {
    console.log('Finding duplicates')

    Object.entries(listWarscrolls(UntaggedWarscrolls)).forEach(([name, factions]) => {
        if (factions.length > 1) console.log(`${name} is in ${factions}`)
    })
}

find_duplicates()