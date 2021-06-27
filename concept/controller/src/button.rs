#[derive(Debug, PartialEq, Eq)]
pub enum Button {
    Up,
    Down,
    Left,
    Right,
    A,
    B,
}

#[derive(Debug, PartialEq, Eq)]
pub enum Input {
    Player1(Button),
    Player2(Button),
    Start,
    Select,

    Nop,
}

pub fn read_input(index: usize) -> Input {
    match index {
        0 => Input::Player1(Button::B),
        1 => Input::Player1(Button::A),
        2 => Input::Player1(Button::Right),
        3 => Input::Player1(Button::Left),
        4 => Input::Player1(Button::Down),
        5 => Input::Player1(Button::Up),

        6 => Input::Start,
        7 => Input::Select,

        8 => Input::Player2(Button::B),
        9 => Input::Player2(Button::A),
        10 => Input::Player2(Button::Right),
        11 => Input::Player2(Button::Left),
        12 => Input::Player2(Button::Down),
        13 => Input::Player2(Button::Up),

        _ => Input::Nop,
    }
}
