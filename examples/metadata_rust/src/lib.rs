#![no_std]

#[panic_handler]
fn handle_panic(_: &core::panic::PanicInfo) -> ! {
    loop {}
}

#[no_mangle]
#[link_section = "title"]
pub static TITLE: [u8; 16] = *b"Metadata Example";

#[no_mangle]
#[link_section = "author"]
pub static AUTHOR: [u8; 17] = *b"Benjamin Thompson";
