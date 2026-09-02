include <../config.scad>

module rounded_rect_2d(size = [20, 20], r = 3) {
    assert(size[0] >= 2*r && size[1] >= 2*r, "rounded_rect_2d radius too large");
    hull() {
        for (x = [r, size[0]-r], y = [r, size[1]-r])
            translate([x, y]) circle(r = r);
    }
}

module rounded_plate(size = [20, 20], r = 3, h = 3) {
    linear_extrude(height = h) rounded_rect_2d(size = size, r = r);
}
