<?php
    header("Content-Type: application/json");
     $database = new mysqli("127.8.20.129 ", "pchwirot", "", "the_board_db", "3306");
     if($database->connect_errno > 0){
         die ("Database Error" . $database->connect_error); 
     }else{
        print "var data = [";
        $query = "SELECT * FROM board_notes";
        //$query = "SELECT * FROM test";
        $result = mysqli_query($database,$query);
        $rowsCount = mysqli_num_rows($result);
        $iterator = 0;
        while(($row = mysqli_fetch_array($result)))
          {
            $iterator++;
            print "{\n";
            print "id:".$row["note_id"].",\n";
            print "addDate:".$row["add_date"].",\n";
            print "noteTextColor:".$row["note_text_color"].",\n";
            print "note:".$row["note"].",\n";
            print "noteBg:".$row["note_bg"].",\n";
            print "zindex:".$row["z_index"].",\n";
            print "width:".$row["width"].",\n";
            print "height:".$row["height"].",\n";
            print "isDone:".$row["is_done"].",\n";
            print "fail:".$row["fail"].",\n";
            print "finishDate:".$row["finish_date"]."\n";
            //$rows[] = $row;
            //$rows[] = $row;
            if($iterator == $rowsCount){
                print "}";
            }else{
                print "},\n";
            }
            
          }
        print "];";
     }
     mysqli_close($database);
?>
