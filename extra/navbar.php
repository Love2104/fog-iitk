<nav id="navbar-main" class="navbar navbar-main navbar-expand-lg navbar-transparent navbar-light headroom">
        <div class="container">
            <div class="row">
                <div class="col">
                    <a class="navbar-brand  w-100" href="/fog-prediction/"><img class="img-fluid" src="./assets/img/fps1.png" style="height:60px;min-width: 150px;"></a>
                </div>
                <div class="col ">
                    <button class="navbar-toggler mt-2" type="button" data-toggle="collapse" data-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation">
                
                    <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
            </div>
        
            <div class="collapse navbar-collapse" id="navbar-default">
                <div class="navbar-collapse-header">
                    <div class="row">
                        <div class="col collapse-brand">

                        </div>
                        <div class="col collapse-close">
                            <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation">
                            <span></span>
                            <span></span>
                        </button>
                        </div>
                    </div>
                </div>

                <ul class="navbar-nav ml-lg-auto">
                    <li>
                        <div class="container w-100">
                      
                            <form role="form" autocomplete="off" method="GET">
                                <div class="form-group">
                                    <div class="autocomplete input-group">
                                        <div class="container pt-3">
                                        <div class="d-flex flex-row justify-content-center">
                                            <div class="">
                                            <input id="myInput" class="form-control" placeholder="Select a location" type="text" style="min-width: 100px;">
                                            </div>
                                            <div class="" >
                                            <input type="button" class="btn btn-primary btn-fab btn-icon btn-round" value="Go" onclick="loaddata(4)">
                                            </div>
                                        <!--<a href="#" class="nav-link" data-toggle="dropdown" href="#" role="button">
                                            <span class="nav-link-inner--text"><button type="button" class="btn btn-primary dropdown-toggle" id="model-choose">Choose Model</button></span>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-left" aria-labelledby="navbar-default_dropdown_1">-->
                                            <!--<a class="dropdown-item" modelno="1" onclick="checkModel(this)" href="#">Gradient Boosting Multiclassifier</a>-->
                                            <!--<a class="dropdown-item" modelno="2" onclick="checkModel(this)" href="#" style="pointer-events: none;cursor:default">Multilayer Perceptron (MLP)</a>
                                            <a class="dropdown-item" modelno="3" onclick="checkModel(this)" href="#" style="pointer-events: none;cursor:default">Gradient Boosting 1</a>-->
                                           <!-- <a class="dropdown-item" modelno="4" onclick="loaddata(this)" href="#">Gradient Boosting Regressor</a>
                                            <a class="dropdown-item" modelno="5" onclick="loaddata(this)" href="#" style="cursor:default">Model 5</a>-->
                                        <!--</div>-->
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </li>
                   
                    
                   
                    <li class="nav-item">
                        <a class="nav-link" href="sensordata.php" target="_blank" style="font-size:medium;font-weight: bold;">IIT Kanpur Weather Station</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="spatialDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="font-size:medium;font-weight: bold;">
                        Spatial Fog <br> Detection
                        </a>
                        <div class="dropdown-menu" aria-labelledby="spatialDropdown">
                            <a class="dropdown-item" href="spatial_fog.php" target="_blank" > Real-Time Spatial Fog </a>

                            <a class="dropdown-item" href="fogcast_lite_forecast.php" target="_blank" > Forecast Spatial Fog </a>
                            
                            
                        </div>
                    </li>
                    
                    <li class="nav-item">
                        <a class="nav-link" href="camera_based_visibility_detection.php" target="_blank" style="font-size:medium;font-weight: bold;">Camera-Based Fog Detection</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="meteorologicalDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="font-size:medium;font-weight: bold;">
                        Compare <br> Results
                        </a>
                        <div class="dropdown-menu" aria-labelledby="meteorologicalDropdown">
                            <a class="dropdown-item" href="comparedata.php" target="_blank" > Real-Time Data Comparison</a>

                            <a class="dropdown-item" href="short_term_forecast_comp.php" target="_blank" > Short-Term Forecast Comparison</a>
                            
                            <a class="dropdown-item" href="long_pred_comp.php" target="_blank">Long-Term Forecast Comparison</a>
                            
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="long_term.php" target="_blank" style="font-size:medium;font-weight: bold;">Long-Term Forecast</a>
                    </li>
                    
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="aboutDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="font-size:medium;font-weight: bold;">
                            About
                        </a>
                        <div class="dropdown-menu" aria-labelledby="aboutDropdown">
                            <a class="dropdown-item" href="about.php" target="_blank" >About Us</a>
                            <a class="dropdown-item" href="publication.php" target="_blank" >Paper Publications</a>
                            <a class="dropdown-item" href="contact_us.php" target="_blank" >Contact Us</a>
                            <?php if($admin) {echo '<a class="dropdown-item" href="new_messages.php" target="_blank" >All Feedbacks</a>'; } ?>
                            
                        </div>
                    </li>
                    
                </ul>

            </div>
        </div>
    </nav>
