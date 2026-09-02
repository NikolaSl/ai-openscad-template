include <../config.scad>
use <../parts/example_part.scad>

DEMO_ANGLE = is_undef(DEMO_ANGLE) ? 25 : DEMO_ANGLE;
assert(DEMO_ANGLE >= EXAMPLE_MOTION_MIN && DEMO_ANGLE <= EXAMPLE_MOTION_MAX,
       "DEMO_ANGLE outside template motion contract");

module example_arm() {
    difference() {
        union() {
            cylinder(d = 18, h = EXAMPLE_ARM_H);
            translate([0, -EXAMPLE_ARM_W/2, 0])
                cube([EXAMPLE_ARM_L, EXAMPLE_ARM_W, EXAMPLE_ARM_H]);
        }
        translate([0, 0, -1]) cylinder(d = EXAMPLE_PIVOT_D, h = EXAMPLE_ARM_H + 2);
    }
}

module example_mechanism(angle = DEMO_ANGLE) {
    example_part();

    pivot = [EXAMPLE_PLATE[0]/2, EXAMPLE_PLATE[1]/2, EXAMPLE_PLATE[2]];
    translate(pivot)
        rotate([0, 0, angle])
            example_arm();

    // Non-printed visual pivot envelope.
    %translate([pivot[0], pivot[1], -2])
        cylinder(d = EXAMPLE_PIVOT_D, h = EXAMPLE_PLATE[2] + EXAMPLE_ARM_H + 4);
}

example_mechanism();
