<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>ASL For Kids</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="css/main.css" media="screen">
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/custom.css">
    <link href="jquery-ui-1.11.2/jquery-ui.css" rel="stylesheet">
    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="bootstrap/html5shiv.js"></script>
    <script src="bootstrap/respond.min.js"></script>
    <![endif]-->
    <style>
        body {
            color: #000000;
        }
        table  { background-color: white;
            border: 1px solid gray;
            border-collapse: collapse; }
        th, td { padding: 30px; border: 1px solid gray; font-size: 36px; text-align: center; }
        tr:nth-child(even) { background-color: lightgreen; }
        tr:first-child { background-color: lightblue; }
    </style>
</head>
<body>

<div class="navbar-static-top">
    <div style="text-align: center"><img src="img/aslforkids-logo.png"
                                         onmouseover="this.src='img/aslforkids-logo-alt.png'"
                                         onMouseOut="this.src='img/aslforkids-logo.png'" align="middle"></div>
</div>

<div class="container">

    <div class="navbar navbar-default ">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse"
                    data-target=".navbar-responsive-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">ASL</a>
        </div>
        <div class="navbar-collapse collapse navbar-responsive-collapse ">
            <ul class="nav navbar-nav">
                <li class="active"><a href="index.html">Home</a></li>
                <li><a href="story.html">Stories</a></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">Games<b class="caret"></b></a>
                    <ul class="dropdown-menu">
                        <li><a href="#">Memory Cards</a></li>
                        <li><a href="#">Mix & Match</a></li>
                    </ul>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li><a href="about.html">About</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
        </div>
    </div>
<?php

$db_host = "localhost";
$db_name = "aslkids";
$db_user = "root";
$db_pass = "";

$database = mysql_connect($db_host, $db_user, $db_pass) or die("MySQL Error: " . mysql_error());
mysql_select_db($db_name) or die("MySQL Error: " . mysql_error());

$name = $_POST["name"];
$score = $_POST["score"];
$game_id = $_POST["gameid"];

$add_score = mysql_query("INSERT INTO scores (username, score, game_id) VALUES('".$name."', '".$score."', '".$game_id."')");
if($add_score) {
    echo "<h1>Success</h1>";
    echo "<p>Your score has been saved!</p>";
} else {
    echo "<h1>Error</h1>";
    echo "<p>Sorry, your score has not been saved.</p>";
}

$score_query = mysql_query("SELECT username, score FROM scores WHERE game_id = " . $game_id);
?>
    <h1 align="center">Scores</h1>
    <table align="center">
        <tr>
            <th>Name: </th>
            <th>Score: </th>
        </tr>
        <?php
        // fetch each record in result set
        for ( $counter = 0; $row = mysql_fetch_row( $score_query );
              ++$counter )
        {
            // build table to display results
            print( "<tr>" );

            foreach ( $row as $key => $value )
                print( "<td>$value</td>" );

            print( "</tr>" );
        }
        mysql_close( $database );
        ?>
    </table>
    <?php
    if($game_id == 1){
        print("<h1 align='center'><a href='memory.html'>Go back to Memory Cards game.</a></h1>");
    } else if($game_id == 2) {
        print("<h1 align='center'><a href='mix_and_match.html'>Go back to Mix & Match game.</a></h1>");
    }
    ?>
</div>
<script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="jquery-ui-1.11.2/jquery-ui.js"></script>
<script src="bootstrap/bootstrap.min.js"></script>
<script src="bootstrap/usebootstrap.js"></script>
</body>
</html>