CREATE TABLE board_notes 
    (
     note_id int auto_increment primary key, 
     add_date varchar(30), 
     fail bit,
     finish_date varchar(30),
     height varchar (10),
     is_done bit,
     left_pos varchar (10),
     note text,
     note_bg varchar (7),
     note_text_color varchar(7),
     top_pos varchar (10),
     width varchar (10),
     z_index int
    );

INSERT INTO board_notes
(add_date, fail, finish_date, height, is_done, left_pos, note, note_bg, note_text_color, top_pos, width, z_index)
VALUES
('data 1', 0, 'finish date 1', '100px', 0, '100px', '1lorem ipsum srutututu', '#ff0000', '#00ffff', '100px', '100px', 10),
('data 2', 0, 'finish date 2', '100px', 0, '100px', '2lorem ipsum srutututu', '#ff0000', '#00ffff', '100px', '100px', 10),
('data 2', 0, 'finish date 2', '100px', 0, '100px', '3lorem ipsum srutututu', '#ff0000', '#00ffff', '100px', '100px', 10);