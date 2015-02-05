<html>
<head>
<title>Bar de nav</title>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
<script type="text/javascript" src="jPGNav.js"></script>

<style>
#container { 
	width: 300px; 
	cursor: default;
	display: block;
	float: left;
	height: 30px;
	margin: 0px;
	overflow: hidden;
	padding: 0px;
	position: relative;
}

#container ul{ 
	
	display: table;
	height: 30px;
	left: 0px;
	list-style: none;
	margin: 0px;
	padding: 0px;
	position: absolute;
	width: 991px;
}

#container li{	
	border: solid 1px black;
	display: table-cell;
	float: none;
	height: 30px;
	list-style: none;
	margin: 0px;
	padding: 0px;
	text-align: left;
	top: 0px;
	width: 132px;
}
.arrowR {
	width: 20px;
	display: block;
	height: 30px;
	background-color: red;
	margin: 0px;
	padding: 0px;
	position: absolute;
	right: 0px;
	top: 0px;
	z-index: 1000;	
}

.arrowL {
	width: 20px;
	background-color: red;
	display: block;
	height: 30px;
	left: 0px;
	margin: 0px;
	padding: 0px;
	position: absolute;
	z-index: 1000;
}
</style>
</head>
 
<body>

<div id="container">
	<div class="arrowR jAnimateTabs" data-animate-direction="next"> >> </div>
	<div class="arrowL jAnimateTabs" data-animate-direction="prev" style="display:none"> << </div>
	<ul class="jList">
		<li>aaaaaa</li>
		<li>bbbbbb</li>
		<li>cccccc</li>
		<li>dddddd</li>
		<li>eeeeee</li>
		<li>ffffff</li>
		<li>gggggg</li>
		<li>hhhhhh</li>
	</ul>
</div>
<script type="text/javascript">

</script>
</body>
<script type="text/javascript">
	$('#container').jPGNav();  
</script>
</html>