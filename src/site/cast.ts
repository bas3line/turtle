/*
 * The cast, as pixel sprites, two frames each. '#' shell, '+' scute, 'o' skin or fur, 'k' eye and
 * dark detail, 'w' tail.
 */
export const SPRITES: Record<'turtle' | 'hare' | 'sleeper', readonly (readonly string[])[]> = {
  turtle: [
    [
      '........######.......',
      '......##+##+###......',
      '.....#+##+##+##+#....',
      '....##+##+##+##+##.oo.',
      '...##############.oook',
      '..k###############oooo',
      '....oo..oo...oo..oo...',
      '...oo....oo.oo....oo..',
    ],
    [
      '........######.......',
      '......##+##+###......',
      '.....#+##+##+##+#....',
      '....##+##+##+##+##.oo.',
      '...##############.oook',
      '..k###############oooo',
      '....oo..oo...oo..oo...',
      '.....oo.oo....oooo....',
    ],
  ],
  hare: [
    [
      '..............o..o..',
      '.............oo.oo..',
      '.............oo.oo..',
      '.............oo.o...',
      '............ooooo...',
      '...........oooooko..',
      '.....ooooooooooooooo',
      '...ooooooooooooooo..',
      '.wwoooooooooooooo...',
      '..ooooooooooooo.....',
      '.ooo.........oo.....',
      'oo............oo....',
    ],
    [
      '..............o..o..',
      '.............oo.oo..',
      '.............oo.oo..',
      '.............oo.o...',
      '............ooooo...',
      '...........oooooko..',
      '......oooooooooooooo',
      '....ooooooooooooooo.',
      '..wwooooooooooooo...',
      '....oooooooooooo....',
      '.....ooo..ooo.......',
      '....oo.....oo.......',
    ],
  ],
  sleeper: [
    [
      '....................',
      '............oooo....',
      '..........ooo.......',
      '....ooooooooooooo...',
      '..oooooooooooooooo..',
      '.wwoooooooooooookko.',
      '..oooooooooooooooooo',
      '...ooo.......oooo...',
    ],
  ],
}
export type SpriteName = keyof typeof SPRITES
export type Palette = Partial<Record<'#' | '+' | 'o' | 'k' | 'w', string>>

export const DAY: Palette = { '#': '#1d3fae', '+': '#2563eb', o: '#6f97f2', k: '#0f1f63', w: '#dbe6fd' }
export const GREY: Palette = { o: '#a9b4c8', k: '#5b6476', w: '#e3e7ee' }
