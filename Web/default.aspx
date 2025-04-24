<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="KaiKai.Web._default" %>

<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
    <meta charset="UTF-8">
    <!--<title>开开集团-订单管理系统</title>-->
    <meta name="viewport" content="width=750,user-scalable=no">
    <meta name="format-detection" content="telephone=no,address=no,email=no">
    <meta name="mobileOptimized" content="width">
    <meta name="handheldFriendly" content="true">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <%if(HttpContext.Current.IsDebuggingEnabled) {%>
    <!--libs-->
    <link href="css/ngDialog.css" rel="stylesheet" />
    <link href="css/ngDialog-theme-default.css" rel="stylesheet" />
    <link href="css/font-awesome.css" rel="stylesheet" />
    <!--libs-->

    <link rel="stylesheet" href="css/style.css"/>


    <!--libs-->
    <script type="text/javascript" src="Scripts/lib/jquery-3.1.1.js"></script>
    <script type="text/javascript" src="Scripts/lib/angular.js"></script>
    <script type="text/javascript" src="Scripts/lib/angular-ui-router.js"></script>
    <script type="text/javascript" src="Scripts/lib/ngDialog.js"></script>
    <!--libs-->

    <!--common js-->
    <script type="text/javascript" src="Scripts/route.js"></script>
    <script type="text/javascript" src="Scripts/service.js"></script>
    <script type="text/javascript" src="Scripts/api.js"></script>
    <script type="text/javascript" src="Scripts/filter.js"></script>
    <script type="text/javascript" src="Scripts/common.js"></script>
    <script type="text/javascript" src="Scripts/directive.js"></script>
    <!--common js-->

    <!--controllers-->
    <script type="text/javascript" src="Scripts/controller/login.js"></script>
    <script type="text/javascript" src="Scripts/controller/home.js"></script>
    <script type="text/javascript" src="Scripts/controller/order_edit.js"></script>
    <script type="text/javascript" src="Scripts/controller/error.js"></script>
    <script type="text/javascript" src="Scripts/controller/orders.js"></script>
    <script type="text/javascript" src="Scripts/controller/head.js"></script>
    <script type="text/javascript" src="Scripts/controller/summary.js"></script>
    <script type="text/javascript" src="Scripts/controller/users.js"></script>
    <script type="text/javascript" src="Scripts/controller/user_edit.js"></script>
    <script type="text/javascript" src="Scripts/controller/password.js"></script>
    <script type="text/javascript" src="Scripts/controller/sizes.js"></script>
    <script type="text/javascript" src="Scripts/controller/size_edit.js"></script>
    <!--controllers-->
    <%} %>
    <%else {%>
    <link rel="stylesheet" href="css/allstyle.css?d=<%=ConfigurationManager.AppSettings["AllCSSDigest"] %>"/>
	<script type="text/javascript" src="Scripts/allscript.js?d=<%=ConfigurationManager.AppSettings["AllScriptDigest"] %>"></script>
    <%}%>
    <!--global vailables-->
    <script>
        app.run(function ($rootScope) {
            $rootScope.APIURL= "<%= ConfigurationManager.AppSettings["ApiUrl"]%>";
         });
        app.constant("htmlTemplates", <%= NGHtmlTemplatesJSON%>);
        app.constant("directiveInculdeHtmlTemplates", <%= NGDirectiveInculdeHtmlTemplatesJSON%>);
    </script>
    <!--global vailables-->
</head>
<body>
    <ui-view id="ui_view"></ui-view>
</body>
</html>