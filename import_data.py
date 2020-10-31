#!/usr/bin/env python3

import glob
import os

if __name__ == "__main__":
    DATA_DIR = os.path.join(os.path.dirname(__file__), 'src', 'warscrolls', 'data')

    text_files = glob.glob(os.path.join(DATA_DIR, '*.txt'))
    print('Found the following source data files:')
    print(text_files)
    print('')

    for text_file_path in text_files:
        ts_file_path = text_file_path.replace('.txt', '.ts')
        if os.path.isfile(ts_file_path):
            print ("{} already exists: skipping".format(ts_file_path))
            continue

        warscrolls = []
        with open(text_file_path, 'r') as f:
            for line in f:
                words = line.split()
                if words[-2] == "x":
                    warscrolls.append((' '.join(words[:-3]), ' '.join(words[-3:])))
                else:
                    warscrolls.append((' '.join(words[:-1]), words[-1]))

        with open(ts_file_path, 'w') as f:
            f.write("""
import { TWarscrolls } from "../types";

const Warscrolls: TWarscrolls = {""")
            for name, size in warscrolls:
                f.write("""
    "{name}" : {{
        baseSize: "{size}",
    }},""".format(name=name, size=size))
            f.write("""
}
export default Warscrolls""")
            print ("{} created".format(ts_file_path))