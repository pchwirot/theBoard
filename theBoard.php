<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>the board</title>
  	<script src="js/lib/jquery-1.9.1.js" type="text/javascript"></script>
  	<script src="js/lib/jquery-ui.js" type="text/javascript"></script>
  	<script src="js/lib/jpicker-1.1.6.js" type="text/javascript"></script>
	<script src="js/dbConnetction.js" type="text/javascript"></script>
    <script src="js/Main.js" type="text/javascript"></script>    

	<link rel="stylesheet" href="css/jquery-ui.css">
	<link rel="stylesheet" media="screen" type="text/css" href="css/jPicker-1.1.6.min.css" />
	<link rel="stylesheet" href="css/styles.css">	
</head>
<body>
	<div id="wrap">
		<div id="workspace"></div>
		<div id="menu">
			<div>
				<p>Wymiary</p>
				<div>
					<input type="text" id="workspaceWidth" name="workspaceWidth" value="900">
					<label for"workspaceWidth">Szerokość</label>
				</div>
				<div>
					<input type="text" id="workspaceHeight" name="workspaceHeight" value="900">
					<label for"workspaceHeight">Wysokość</label>
				</div>
				<div>
					<input type="text" id="workspaceBG" name="workspaceHeight" value="00000	">
					<label for"workspaceHeight">Kolor</label>
				</div>
				<button id="setBoard">Ustaw</button>
			</div>

			<div>
				<input type="text" id="addNoteValue" name="addNoteValue">
				<button id="addNote">Dodaj notatkę</button>
			</div>
			<div>
				<button id="loadData">Załaduj</button><button id="saveData">Zapisz</button>
			</div>
			<div>
				<button id="clearSavedData">Wyczyść zapisane dane</button>
			</div>
            <div>
                <button id="getDataFromDB">Zaaduj z bazy (test)</button>
            </div>
			<div class="loger">
				<textarea id="logArea"> </textarea>
			</div>
		</div>
	</div>
</body>
</html>
