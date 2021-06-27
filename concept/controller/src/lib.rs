#![no_std]

use button::Input;
use core::panic::PanicInfo;

mod button;

/// Controller buffer.
///
/// Supports 2 players, p1 and p2 as well as Start (S) and Select (X).
///
/// ```
/// 16 14     8  6      0
/// |rr|UDLRAB|XS|UDLRAB|
/// |  |  p2  |  |  p1  |
/// ```
///
/// On each tick, if the console registers a button being pressed then the corresponding bit will
/// be flipped on, otherwise all bits will be off.
///
/// When an input is on, setting it to off will deregister the button until it is released and
/// pressed again. This allows for inputs to be read exactly ocne despite being held down for
/// multiple frames - inspired by jordwest/cavernos.
#[no_mangle]
static mut CONTROLLER: u16 = 0;

#[no_mangle]
pub unsafe extern "C" fn tick() {
    next_frame(&mut CONTROLLER);
}

fn next_frame(buf: &mut u16) {
    // Deregister inputs from player 2 when activated.
    for i in 0..16 {
        let mask = 1 << i;

        let is_active = (*buf & mask) > 0;
        if is_active {
            match button::read_input(i) {
                Input::Player2(_) | Input::Start | Input::Select => {
                    *buf ^= mask;
                }
                _ => {}
            }
        }
    }
}

#[cfg(not(test))]
#[panic_handler]
fn handle_panic(_info: &PanicInfo) -> ! {
    loop {}
}

#[cfg(test)]
mod tests {
    extern crate std;

    use super::*;
    use button::Button;
    use std::{println, vec::Vec};

    #[test]
    fn read_controller() {
        let controller = 0b00_100000_10_000001;

        let mut active = Vec::new();
        for i in 0..14 {
            if (controller & (1 << i)) > 0 {
                active.push(button::read_input(i))
            }
        }

        assert_eq!(active, [Input::Player1(Button::B), Input::Start, Input::Player2(Button::Up)]);
    }

    #[test]
    fn write_controller() {
        let mut controller = 0b00_100000_10_000001;

        for i in 0..14 {
            let mask = 1 << i;
            if (controller & mask) > 0 {
                controller &= mask ^ 0xffff;
            }
        }

        assert_eq!(controller, 0);
    }
}
