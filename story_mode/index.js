// 故事模式Story Mode:
// 作者：WS3917 from PSOT汉化组
import { modText, modFolders, LP } from 'mods:init_mod/index.js';
const modName = modFolders[1];  // story_mode
const modMenuname = modName + '_menu';
// Bug1: 将下面的Option添加到SAVE
// Bug2: 语言走的是Auto
// Bug3: 标题自适应居中
// Bug4: 游戏内跳转
// 日文：添加方引号和全角百分号字符
/** @type {import('../../code/index').OutertaleMod} */
flagNumber.storymode_option = info(0);
flagBoolean.truedeath_enabled = info(false);
flagNumber.resurrect_life = info(0);
flagNumber.rdencounter_mode = info(0);
flagNumber.killrequire_mode = info(0);
flagBoolean.puzzlereduce_enabled = info(false);
flagBoolean.timeextend_enabled = info(false);
/** @type {import('../../code/index').OutertaleMod} */
export default async function (mod, api) {
    // 导入API
    const {
        CosmosNavigator,
        CosmosObject,
        menuText,
        menuFinder,
        SAVE,
        frontEnder,
        atlas,
        info,
        CosmosUtils,
        backend
    } = api;

    const storymode_setup = option => {
        if (option === 1) {
            SAVE.flag.b.truedeath_enabled = true;   // True death
            SAVE.flag.n.resurrect_life = 0;     // No extra life
            SAVE.flag.n.rdencounter_mode = 3;   // Remove random encounter
            SAVE.flag.n.killrequire_mode = 3;   // Killing requirement set to 0
            SAVE.flag.b.puzzlereduce_enabled = true;    // reduce puzzle
            SAVE.flag.b.timeextend_enabled = true;  // More time limit
        }
        else if (option === 0) {
            SAVE.flag.b.truedeath_enabled = false;   // True death
            SAVE.flag.n.resurrect_life = 0;     // No extra life
            SAVE.flag.n.rdencounter_mode = 0;   // Remove random encounter
            SAVE.flag.n.killrequire_mode = 0;   // Killing requirement set to 0
            SAVE.flag.b.puzzlereduce_enabled = false;    // reduce puzzle
            SAVE.flag.b.timeextend_enabled = false;  // More time limit
        }
    }
    // 首先设计菜单项 - Making the menu
    atlas.navigators.register({
        [modMenuname]: new CosmosNavigator({
            // Menu items
            grid: () => [
                [
                    'back_mod',
                    'enable_story',
                    ...(SAVE.flag.n.storymode_option === 2 ? [
                        'death',
                        ...(SAVE.flag.b.truedeath_enabled ? ['resurrect'] : []),
                        'random_encounter',
                        ...(SAVE.flag.n.rdencounter_mode !== 3 ? ['kill_requirement'] : []),
                        'puzzle_reduce',
                        'time_limit'] : [])
                ]
            ],
            // 选项功能 -- button functions
            next(self) {
                const selection = self.selection();
                switch (selection) {
                    case 'back_mod':
                        return 'modSettings';
                    case 'enable_story':
                        SAVE.flag.n.storymode_option = (SAVE.flag.n.storymode_option + 1) % 3;
                        storymode_setup(SAVE.flag.n.storymode_option);
                        break;
                    case 'death':
                        SAVE.flag.b.truedeath_enabled = !SAVE.flag.b.truedeath_enabled;
                        break;
                    case 'resurrect':
                        SAVE.flag.n.resurrect_life = (SAVE.flag.n.resurrect_life + 1) % 4;
                        break;
                    case 'random_encounter':
                        SAVE.flag.n.rdencounter_mode = (SAVE.flag.n.rdencounter_mode + 1) % 4;
                        break;
                    case 'kill_requirement':
                        SAVE.flag.n.killrequire_mode = (SAVE.flag.n.killrequire_mode + 1) % 4;
                        break;
                    case 'puzzle_reduce':
                        SAVE.flag.b.puzzlereduce_enabled = !SAVE.flag.b.puzzlereduce_enabled;
                        break;
                    case 'time_limit':
                        SAVE.flag.b.timeextend_enabled = !SAVE.flag.b.timeextend_enabled;
                        break;
                }
            },
            objects: [
                frontEnder.createBackground(Number.MAX_SAFE_INTEGER),
                new CosmosObject({
                    fontName: 'DeterminationSans',
                    fontSize: 16,
                    priority: Number.MAX_SAFE_INTEGER,
                    objects: [
                        // 标题 - Title
                        menuText(
                            360 - 16 * CosmosTextUtils.cjk_length(LP.getTextForCurrentLanguage('name', modName))
                            , 36 - 4, () => LP.getTextForCurrentLanguage('name', modName), {
                            fontName: 'DeterminationSans',
                            fontSize: 32
                        }),
                        menuText(
                            40,
                            84,
                            () => `§fill:${menuFinder(modMenuname, 'back_mod') ? '#ff0' : '#fff'}§${LP.getTextForCurrentLanguage('back_mod')}`
                        ),
                        menuText(
                            40,
                            84 + 41,
                            () => `§fill:${menuFinder(modMenuname, 'enable_story') ? '#ff0' : '#fff'}§${LP.getTextForCurrentLanguage('enable_story', modName)}`
                        ),
                        menuText(
                            400,
                            84 + 41,
                            () => `§fill:${menuFinder(modMenuname, 'enable_story') ? '#ff0' : SAVE.flag.n.storymode_option === 0 ? '#fff' : '#0f0'}
                            §${LP.getTextForCurrentLanguage('regular_options', modName)[SAVE.flag.n.storymode_option]}`
                        ),
                        menuText(
                            40,
                            84 + 41 * 2,
                            () => `§fill:${menuFinder(modMenuname, 'death') ? '#ff0'
                                : SAVE.flag.n.storymode_option === 2 ? '#fff' : '#777'}§${LP.getTextForCurrentLanguage('death', modName)}`
                        ),
                        menuText(
                            400,
                            84 + 41 * 2,
                            () => `§fill:${menuFinder(modMenuname, 'death') ? '#ff0' : SAVE.flag.n.storymode_option !== 2 ? '#777'
                                : !SAVE.flag.b.truedeath_enabled ? '#fff' : '#0f0'}
                            §${LP.getTextForCurrentLanguage('regular_options', modName)[SAVE.flag.b.truedeath_enabled ? 1 : 0]}`
                        ),
                        menuText(
                            40,
                            84 + 41 * 3,
                            () => `§fill: ${menuFinder(modMenuname, 'resurrect') ? '#ff0'
                                : SAVE.flag.n.storymode_option === 2 ? '#fff' : '#777'
                                }§${LP.getTextForCurrentLanguage('resurrect', modName)}`
                        ),
                        menuText(
                            400,
                            84 + 41 * 3,
                            () => `§fill:${menuFinder(modMenuname, 'resurrect') ? '#ff0' : SAVE.flag.n.storymode_option !== 2 || !SAVE.flag.b.truedeath_enabled ? '#777'
                                : SAVE.flag.n.resurrect_life === 0 ? '#fff' : '#0f0'}
                            §${LP.getTextForCurrentLanguage('resurrect_count', modName)[SAVE.flag.n.resurrect_life]}`
                        ),
                        menuText(
                            40,
                            84 + 41 * 4,
                            () => `§fill: ${menuFinder(modMenuname, 'random_encounter') ? '#ff0'
                                : SAVE.flag.n.storymode_option === 2 ? '#fff' : '#777'
                                }§${LP.getTextForCurrentLanguage('random_encounter', modName)}`
                        ),
                        menuText(
                            400,
                            84 + 41 * 4,
                            () => `§fill:${menuFinder(modMenuname, 'random_encounter') ? '#ff0' : SAVE.flag.n.storymode_option !== 2 ? '#777'
                                : SAVE.flag.n.rdencounter_mode === 0 ? '#fff' : '#0f0'}
                            §${LP.getTextForCurrentLanguage('random_options', modName)[SAVE.flag.n.rdencounter_mode]}`
                        ),
                        menuText(
                            40,
                            84 + 41 * 5,
                            () => `§fill: ${menuFinder(modMenuname, 'kill_requirement') ? '#ff0'
                                : SAVE.flag.n.storymode_option === 2 ? '#fff' : '#777'
                                }§${LP.getTextForCurrentLanguage('kill_requirement', modName)}`
                        ),
                        menuText(
                            400,
                            84 + 41 * 5,
                            () => `§fill:${menuFinder(modMenuname, 'kill_requirement') ? '#ff0' : SAVE.flag.n.storymode_option !== 2 || SAVE.flag.n.rdencounter_mode === 3 ? '#777'
                                : SAVE.flag.n.killrequire_mode === 0 ? '#fff' : '#0f0'}
                            §${SAVE.flag.n.rdencounter_mode === 3 ?
                                    LP.getTextForCurrentLanguage('kill_options', modName)[3]
                                    : LP.getTextForCurrentLanguage('kill_options', modName)[SAVE.flag.n.killrequire_mode]}`
                        ),
                        menuText(
                            40,
                            84 + 41 * 6,
                            () => `§fill: ${menuFinder(modMenuname, 'puzzle_reduce') ? '#ff0'
                                : SAVE.flag.n.storymode_option === 2 ? '#fff' : '#777'
                                }§${LP.getTextForCurrentLanguage('puzzle_reduce', modName)}`
                        ),
                        menuText(
                            400,
                            84 + 41 * 6,
                            () => `§fill:${menuFinder(modMenuname, 'puzzle_reduce') ? '#ff0' : SAVE.flag.n.storymode_option !== 2 ? '#777'
                                : !SAVE.flag.b.puzzlereduce_enabled ? '#fff' : '#0f0'}
                            §${LP.getTextForCurrentLanguage('regular_options', modName)[SAVE.flag.b.puzzlereduce_enabled ? 1 : 0]}`
                        ),
                        menuText(
                            40,
                            84 + 41 * 7,
                            () => `§fill: ${menuFinder(modMenuname, 'time_limit') ? '#ff0'
                                : SAVE.flag.n.storymode_option === 2 ? '#fff' : '#777'
                                }§${LP.getTextForCurrentLanguage('time_limit', modName)}`
                        ),
                        menuText(
                            400,
                            84 + 41 * 7,
                            () => `§fill:${menuFinder(modMenuname, 'time_limit') ? '#ff0' : SAVE.flag.n.storymode_option !== 2 ? '#777'
                                : !SAVE.flag.b.timeextend_enabled ? '#fff' : '#0f0'}
                            §${LP.getTextForCurrentLanguage('time_options', modName)[SAVE.flag.b.timeextend_enabled ? 1 : 0]}`
                        ),
                        menuText(
                            40,
                            84 + 41 * 8,
                            () => `§fill:#777§${LP.get_subModIntro([
                                'back_mod',
                                'enable_story',
                                'death',
                                'resurrect',
                                'random_encounter',
                                'kill_requirement',
                                'puzzle_reduce',
                                'time_limit'
                            ], modMenuname, modName)
                                }`,
                            {
                                fontName: 'DeterminationSans',
                                fontSize: 8
                            }
                        )
                    ]
                })
            ]
        }).on('from', function () {
            this.position = { x: 0, y: 0 };
            atlas.attach(renderer, 'menu', modMenuname);
        }).on('to', function () {
            atlas.detach(renderer, 'menu', modMenuname);
        })
    });
}
