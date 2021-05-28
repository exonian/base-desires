import { UntaggedWarscrolls } from "../../warscrolls/data";
import { TFactionWarscrolls, TWarscrolls } from "../../warscrolls/types";

const find_duplicates = () => {
  console.log('Finding duplicates')
  const warscrollsAndFactions: Record<string, string[]> = {}

  UntaggedWarscrolls.forEach(faction => {
    Object.keys(faction.warscrolls).forEach(name => {
      const match = warscrollsAndFactions[name]
      if (match) {
        console.log(`${name} in ${faction.faction} is already present in ${match}`)
        warscrollsAndFactions[name] = [...match, faction.faction]
      }
      else {
        warscrollsAndFactions[name] = [faction.faction]
      }
    })
  })
}

find_duplicates()