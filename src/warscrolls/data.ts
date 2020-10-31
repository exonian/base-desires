import { TWarscrolls } from "./types";
import Beasts_Of_ChaosWarscrolls from "./data/beasts_of_chaos"
import Blades_Of_KhorneWarscrolls from "./data/blades_of_khorne"
import Daemons_Of_ChaosWarscrolls from "./data/daemons_of_chaos"
import Disciples_Of_TzeentchWarscrolls from "./data/disciples_of_tzeentch"
import Hedonites_Of_SlaaneshWarscrolls from "./data/hedonites_of_slaanesh"
import Legions_Of_AzgorhWarscrolls from "./data/legions_of_azgorh"
import Maggotkin_Of_NurgleWarscrolls from "./data/maggotkin_of_nurgle"
import Monsters_Of_ChaosWarscrolls from "./data/monsters_of_chaos"
import SkavenWarscrolls from "./data/skaven"
import Slaves_To_DarknessWarscrolls from "./data/slaves_to_darkness"
import StormcastWarscrolls from "./data/stormcast"
import Tamurkhans_HordeWarscrolls from "./data/tamurkhans_horde"

export const Warscrolls: TWarscrolls = {
    ...Beasts_Of_ChaosWarscrolls,
    ...Blades_Of_KhorneWarscrolls,
    ...Daemons_Of_ChaosWarscrolls,
    ...Disciples_Of_TzeentchWarscrolls,
    ...Hedonites_Of_SlaaneshWarscrolls,
    ...Legions_Of_AzgorhWarscrolls,
    ...Maggotkin_Of_NurgleWarscrolls,
    ...Monsters_Of_ChaosWarscrolls,
    ...SkavenWarscrolls,
    ...Slaves_To_DarknessWarscrolls,
    ...StormcastWarscrolls,
    ...Tamurkhans_HordeWarscrolls,
}