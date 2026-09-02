include <../config.scad>

// A deliberately remote fixed obstruction used only to validate the generic
// collision/distance QA engine in a template repository.
translate([105, 95, EXAMPLE_PLATE[2]])
    cube([12, 12, 24]);
