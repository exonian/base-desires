#!/usr/bin/env python3

import glob
import os

if __name__ == "__main__":
    SKIP_ALREADY_IMPORTED = False
    SOURCE_DATA_DIR = os.path.join(os.path.dirname(__file__), 'src', 'warscrolls', 'text_data')
    DEST_DATA_DIR = os.path.join(os.path.dirname(__file__), 'src', 'warscrolls', 'data')
    DATA_FILE = os.path.join(os.path.dirname(__file__), 'src', 'warscrolls', 'data.ts')

    text_files = glob.glob(os.path.join(SOURCE_DATA_DIR, '*.txt'))
    print('Found the following source data files:')
    print(text_files)
    print('')

    sizes = set()

    for text_file_path in text_files:
        ts_file_path = text_file_path.replace(SOURCE_DATA_DIR, DEST_DATA_DIR).replace('.txt', '.ts')
        if SKIP_ALREADY_IMPORTED and os.path.isfile(ts_file_path):
            print ("{} already exists: skipping".format(ts_file_path))
            continue

        warscrolls = []
        with open(text_file_path, 'r') as f:
            for line in f:
                words = line.split()
                notes = ""
                if words[-1][-1] == ")":
                    opening_bracket = [words.index(word) for word in words if word.startswith('(')][-1]
                    notes = ' '.join(words[opening_bracket:])
                    words = words[:opening_bracket]

                if len(words) >=2 and words[-2] == "x":
                    name = ' '.join(words[:-3])
                    size = ' '.join(words[-3:])
                elif words[-2:] == ["Use", "model"]:
                    name = ' '.join(words[:-2])
                    size = ' '.join(words[-2:])
                else:
                    name = ' '.join(words[:-1])
                    size = words[-1]
                warscrolls.append((name, size, notes))
                sizes.update([size])

        with open(ts_file_path, 'w') as f:
            f.write("""
import { TWarscrolls } from "../types";

const Warscrolls: TWarscrolls = {""")
            for name, size, notes in warscrolls:
                f.write("""
    "{name}" : {{
        baseSize: "{size}",
        notes: "{notes}",
    }},""".format(name=name, size=size, notes=notes))
            f.write("""
}
export default Warscrolls""")
            print ("{} created".format(ts_file_path))

    ts_files = glob.glob(os.path.join(DEST_DATA_DIR, '*.ts'))
    module_names = sorted([os.path.relpath(f, DEST_DATA_DIR).split(".ts")[0] for f in ts_files])
    print('')
    print('Updating combined data file to import the following typescript data files:')
    print(', '.join(module_names))
    print('')
    with open(DATA_FILE, 'w') as f:
        f.write("""import { TWarscrolls } from "./types";\n\n""")
        for module in module_names:
            f.write('''import {module_title}Warscrolls from "./data/{module}"\n'''.format(module=module, module_title=module.title()))
        f.write("\n")
        f.write("export const Warscrolls: TWarscrolls = {\n")
        for module in module_names:
            f.write("    ...{module_title}Warscrolls,\n".format(module=module, module_title=module.title()))
        f.write("}")

    print('The following base sizes were detected:')
    for size in sizes:
        print('''| "{}"'''.format(size))