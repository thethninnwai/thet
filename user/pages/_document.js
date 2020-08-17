import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {

  render() {

    return (
      <html>
        <Head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
            <meta name="description" content=""/>
            <meta name="author" content=""/>
            <link rel="icon" href="assets/images/logoo.ico"/>
            <link href="https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900&display=swap" rel="stylesheet"/>

            <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"/>

            <link rel="stylesheet" href="assets/css/fontawesome.css"/>
            <link rel="stylesheet" href="assets/css/style.css"/>
            <link rel="stylesheet" href="assets/css/owl.css"/>
            
            <script src="vendor/jquery/jquery.min.js"></script>
            <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>


            <script src="assets/js/custom.js"></script>
            <script src="assets/js/owl.js"></script>

            <script src="/__/firebase/7.15.5/firebase-app.js"></script>

            <script src="/__/firebase/7.15.5/firebase-analytics.js"></script>

            <script src="/__/firebase/init.js"></script>

        </Head>
        <body>
          <Main></Main>
          
          <NextScript></NextScript>
        </body>
        
      </html>
    );
  }
}