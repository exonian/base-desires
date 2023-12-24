import { UntaggedWarscrolls } from "../../warscrolls/data";
import { listWarscrolls } from "../data";

const list_warscrolls = () => {
    console.log('Listing warscrolls')

    Object.entries(listWarscrolls(UntaggedWarscrolls)).forEach(([name, factions]) => {
        console.log(`${name} (${factions})`)
    })
}

list_warscrolls()