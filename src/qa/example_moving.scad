include <../config.scad>

// Reference-pose moving collision body for mesh_motion_qa.py.
pivot = [EXAMPLE_PLATE[0]/2, EXAMPLE_PLATE[1]/2, EXAMPLE_PLATE[2]];
translate(pivot) {
    cylinder(d = 18, h = EXAMPLE_ARM_H);
    translate([0, -EXAMPLE_ARM_W/2, 0])
        cube([EXAMPLE_ARM_L, EXAMPLE_ARM_W, EXAMPLE_ARM_H]);
}
