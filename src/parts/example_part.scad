include <../config.scad>
use <../lib/util.scad>

module example_part() {
    difference() {
        rounded_plate(EXAMPLE_PLATE, EXAMPLE_CORNER_R, EXAMPLE_PLATE[2]);
        for (x = [(EXAMPLE_PLATE[0]-EXAMPLE_HOLE_SPACING[0])/2,
                  (EXAMPLE_PLATE[0]+EXAMPLE_HOLE_SPACING[0])/2],
             y = [(EXAMPLE_PLATE[1]-EXAMPLE_HOLE_SPACING[1])/2,
                  (EXAMPLE_PLATE[1]+EXAMPLE_HOLE_SPACING[1])/2])
            translate([x, y, -1])
                cylinder(d = EXAMPLE_HOLE_D, h = EXAMPLE_PLATE[2] + 2);

        // Deliberately simple central service slot for section-view QA.
        translate([EXAMPLE_PLATE[0]/2 - 12, EXAMPLE_PLATE[1]/2 - 3, -1])
            cube([24, 6, EXAMPLE_PLATE[2] + 2]);
    }
}

example_part();
