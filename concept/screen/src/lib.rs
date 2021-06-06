#![no_std]

use core::panic::PanicInfo;

/// Screen size of a GameBoy Advance.
///
/// # Memory size
///
/// Assuming 16 colors, which means 4 bits per pixel
///   - 240 width * 160 height = 38,400 pixels
///   - 38,400 pixels * 4 bits per pixel = 153,600 bits
///   - 614,400 bits / 8 bits per byte = 19,200 bytes
///   - 19,200 / 1,024 = 18.75 KiB
const WIDTH: usize = 240;
const HEIGHT: usize = 160;

/// Number of pixels in the SCREEN.
///
/// SCREEN is a buffer of u32. Since each pixel is encoded by 4 bits (for supporting 16 colors)
/// each u32 represents 8 consecutive pixels.
const NPIXELS: usize = WIDTH * HEIGHT / 8;

#[no_mangle]
static mut SCREEN: [u32; NPIXELS] = [0; NPIXELS];

#[no_mangle]
pub unsafe extern "C" fn tick() {
    next_frame(&mut SCREEN);
}

fn next_frame(buf: &mut [u32; NPIXELS]) {
    for pixel in buf.iter_mut() {
        *pixel = 0x11114444;
    }
}

#[panic_handler]
fn handle_panic(_info: &PanicInfo) -> ! {
    loop {}
}
