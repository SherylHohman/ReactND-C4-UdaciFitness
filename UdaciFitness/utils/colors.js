// Chosen App Accent color clashes !!
//  Since it's used as background colors for android buttons
//    as opposed to skinny text inside of white backgrounds on ios,
//    it makes the Android "material design" look particularly garrish
//  So, I'm changing that color.
//  I'd probably change the Android style to use white buttons, ect, as ios does
//    but I'm not familiar with the "material design" guidelines.
//    so, I'll assume for now that Tyler McGinnis was following md guidelines
//    and instead choose a color that does *Not* clash!
//    It is *possible* that colored backgrounds for buttongs is *not* part of \
//    of the material design spec, and is instead just how he chose to
//    differentiate the styling for the two devices, in order to show us how it
//    is done.
//    In that case, I'd probably rather go with color on white (like his ios design)
//    rather than white on color.
//    Although, swapping out the purple for blue, and leaving the design specs
//    the same otherwise, helps TREMENDOUSLY.  white on color actually looks fine, now.


const yellow45 = '#e6e600';
const yellow40 = '#cccc00'; //darker

const orange60 = '#ffad33'; //lighter
//    orange50 = '#ff9900'  //orange
const orange45 = '#e68a00'; //darker    (best for ios button outline)
const orange43 = '#db8400'; //dark      (best compromise for ios button and android tab)
const orange42 = '#d68100';
const orange40 = '#cc7a00'; //too dark  (best for tab underline)
export const primaryColor = 'orange'          //  'gray'
// export const primaryColorLight = orange60; // yellow40
export const primaryColorDark  = orange43;    // yellow40  // 'darkgray'
// export const secondaryColor = yellow40;    // gray;


// export const purple = '#483FAF'
// HACK: copy "blue" into the purple name
//  to use blue color, without changing "purple" ref throughout app
// export const purple = '#4b49b6'  // barely darker than blue (see below)
// export const purple = '#4e4cb8'  // blue (see below)
// export const purple = '#463AAB'  // this one looks ok, too, it's just slightly darker

// Orig "purple" CLASHES ! - particularly evident on Android as it's used for button backgrounds
// export const purple = '#292477'
export const gray = '#757575'
export const white = '#fff'
export const red = '#b71845'
export const orange = '#f26f28'
export const blue = '#4e4cb8'
export const lightPurp = '#7c53c3'
export const pink = '#b93fb3'
