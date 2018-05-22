function App()
{
    this.mount = document.getElementById("app");
//    this.current_adapter = 0;
//    this.adapters = {};
    this.error_message = null;
    this.error_timeout = null;

//Retrieve metadata for each adapter
var meta = {};
var promises = adapters.map(
    function(adapter, i)
    {
        return apiGET(i, "", true).then(
            function(data)
            {
                meta[adapter] = data;
            }
        );
    }
);

//Then generate the page and start the update loop
$.when.apply($, promises)
.then(
    (function()
    {
        this.generate(meta);
//        setTimeout(this.update.bind(this), this.update_delay * 1000);
    }).bind(this)
);
}


//App.prototype.update_delay = 0.2;
App.prototype.dark_mode = false;

//Submit GET request then update the current adapter with new data
//App.prototype.update =
//    function()
//    {
//        var updating_adapter = this.current_adapter;
//    };


//Construct page and call components to be constructed
App.prototype.generate =
    function(meta)
    {
        //Construct navbar
        var navbar = document.createElement("nav");
        navbar.classList.add("navbar");
        navbar.classList.add("navbar-inverse");
        navbar.classList.add("navbar-fixed-top");
        navbar.innerHTML = `
<div class="container-fluid">
    <div class="navbar-header">
        <div class="navbar-brand">
            Odin Server
        </div>
    </div>
    <img class="logo" src="img/stfc_logo.png">
    <ul class="nav navbar-nav" id="adapter-links"></ul>

    <ul class="nav navbar-nav navbar-right">
        <li class="dropdown">
            <a class="dropdown-toggle" href=# data-toggle="dropdown">
                Options
                <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
                <li><a href="#" id="toggle-dark">Toggle Dark</a></li>
            </ul>
        </li>
    </ul>
</div>`;
        this.mount.appendChild(navbar);
        document.getElementById("toggle-dark").addEventListener("click", this.toggleDark.bind(this));
        this.documentBody = document.getElementsByTagName("body")[0];
        var nav_list = document.getElementById("adapter-links");

        //Create error bar
        var error_bar = document.createElement("div");
        error_bar.classList.add("error-bar");
        this.mount.appendChild(error_bar);
        this.error_message = document.createTextNode("");
        error_bar.appendChild(this.error_message);


        //Add Configuration Page
        //Create DOM node for adapter
       var container = document.createElement("div");
       container.id = "configuration-page";
       container.classList.add("adapter-page");
       container.innerHTML = `
<div id="configure-container" class="flex-container">
<div class="parent-column">
<h4>Configuration</h4>
<p class="desc">
    Configuration options for the ASIC and Backplane
    </p>
<div class="vertical">
    <div>
        <h5>
            Clock:
        </h5>
        <div class="variable-padding">
            <div class="padder"></div>
        </div>
        <div>
<div class="input-group" title="Clock frequency for the SI570 oscillator">
    <input class="form-control text-right" id="clock-input" aria-label="Value" placeholder="10.0" type="text">
    <span class="input-group-addon">MHz</span>
    <div class="input-group-btn">
        <button class="btn btn-default" id="clock-button" type="button">Set</button>
    </div>
</div>
        </div>
    </div>

    <div>
        <h5>
            Refresh Backplane:
        </h5>
        <div class="variable-padding">
            <div class="padder"></div>
        </div>
        <div>
<button id="bp-refresh-button" type="button" class="btn btn-default">Update</button>
        </div>
    </div>

    <div>
        <h5>
            Backplane Updating:
        </h5>
        <div class="variable-padding">
            <div class="padder"></div>
        </div>
        <div>

<button id="bp-update-button" type="button" class="btn btn-toggle btn-success">Disable</button>
        </div>
    </div>
</div>
</div>
    <div class ="child-column">
        <div class="child">
            <div class="child-header">
                <div id="ASIC-collapse" class="collapse-button">
                    <div class="collapse-table">
                        <span id="ASIC-button-symbol" class="collapse-cell    glyphicon glyphicon-triangle-bottom"></span>
                    </div>
                </div>
                <h4>ASIC</h4>
            </div>
            <div id="ASIC-container">
                <div class="flex-container">
                    <h5>Image Capture Vector File:</h5>
                    <div class="input-group" title="File location for the image capture vector file">
                        <input id="capture-vector-input" class="form-control text-right" aria-label="Test Cases" placeholder=" " type="text">
                    </div>
                    <div class="input-group-btn">
                        <button id="capture-vector-browse-btn" class="btn btn-default" type="button">Browse</button>
                    </div>
                </div>
                <div class="flex-container">
                    <h5>ASIC Configuration Vector File:</h5>
                    <div class="input-group" title="File location for the image capture vector file">
                        <input id="configure-vector-input" class="form-control text-right" aria-label="Test Cases" placeholder=" " type="text">
                    </div>
                    <div class="input-group-btn">
                        <button id="configure-vector-browse-btn" class="btn btn-default" type="button">Browse</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="child">
            <div class="child-header">
                <div id="DAC-collapse" class="collapse-button">
                    <div class="collapse-table">
                        <span id="DAC-button-symbol" class="collapse-cell    glyphicon glyphicon-triangle-bottom"></span>
                    </div>
                </div>
                <h4>DAC</h4>
            </div>
            <div id="DAC-container" class="flex container">
                <div class="table-container">
<table>
    <thead>
        <tr>
            <td></td>
            <th>Value</th>
            <td></td>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th class="text-right">iBiasPLL</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-0-input" aria-label="Value" placeholder="010100" type="text">
                </div>
            </td>
            <th class="text-right">iBiasCalC</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-10-input" aria-label="Value" placeholder="001100" type="text">
                </div>
            </td>
        </tr>
        <tr>
            <th class="text-right">iBiasLVDS</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-1-input" aria-label="Value" placeholder="101101" type="text">
                </div>
            </td>
            <th class="text-right">iBiasADCbuffer</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-11-input" aria-label="Value" placeholder="001100" type="text">
                </div>
            </td>
        </tr>
        <tr>
            <th class="text-right">iBiasAmpLVDS</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-2-input"  aria-label="Value" placeholder="010000" type="text">
                </div>
            </td>
            <th class="text-right">iBiasLoad</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-12-input" aria-label="Value" placeholder="001010" type="text">
                </div>
            </td>
        </tr>
        <tr>
            <th class="text-right">iBiasADC2</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-3-input" aria-label="Value" placeholder="010100" type="text">
                </div>
            </td>
            <th class="text-right">iBiasOutSF</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-13-input" aria-label="Value" placeholder="011001" type="text">
                </div>
            </td>
        </tr>
        <tr>
            <th class="text-right">iBiasADC1</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-4-input" aria-label="Value" placeholder="010100" type="text">
                </div>
            </td>
            <th class="text-right">iBiasSF1</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-14-input" aria-label="Value" placeholder="001010" type="text">
                </div>
            </td>
        </tr>
        <tr>
            <th class="text-right">iBiasCalF</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-5-input" aria-label="Value" placeholder="010010" type="text">
                </div>
            </td>
            <th class="text-right">iBiasPGA</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-15-input" aria-label="Value" placeholder="001100" type="text">
                </div>
            </td>
        </tr>
        <tr>
            <th class="text-right">iFbiasN</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-6-inputt" aria-label="Value" placeholder="011000" type="text">
                </div>
            </td>
            <th class="text-right">vBiasPGA</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-16-input" aria-label="Value" placeholder="000000" type="text">
                </div>
            </td>
        </tr>
        <tr>
            <th class="text-right">vBiasCasc</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-7-input" aria-label="Value" placeholder="100000" type="text">
                </div>
            </td>
            <th class="text-right">iBiasSF0</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-17-input" aria-label="Value" placeholder="000101" type="text">
                </div>
            </td>
        </tr>
        <tr>
            <th class="text-right">iCbiasP</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-8-input" aria-label="Value" placeholder="011010" type="text">
                </div>
            </td>
            <th class="text-right">iBiasCol</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-18-input" aria-label="Value" placeholder="001100" type="text">
                </div>
            </td>
        </tr>
        <tr>
            <th class="text-right">iBiasRef</th>
            <td>
                <div class="input-group">
                    <input class="form-control text-right" id="DAC-9-input" aria-label="Value" placeholder="001010" type="text">
                </div>
            </td>
        </tr>
    </tbody>
</table>
                </div>
                <div class="flex container">
                    <h5>Image Capture Pattern</h5>
                    <div class="input-group-btn">
                        <button id="load-capture-button" class="btn btn-default" type="button">Load</button>
                        <button id="save-capture-button" class="btn btn-default" type="button">Save</button>
                    </div>
                </div>
                <div class="flex container">
                    <h5>ASIC Configuration Pattern</h5>
                    <div class="input-group-btn">
                        <button id="load-configuration-button" class="btn btn-default" type="button">Load</button>
                        <button id="save-configuration-button" class="btn btn-default" type="button">Save</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="child">
            <div class="child-header">
                <div id="variable-supply-collapse" class="collapse-button">
                    <div class="collapse-table">
                        <span id="variable-supply-button-symbol" class="collapse-cell    glyphicon glyphicon-triangle-bottom"></span>
                    </div>
                </div>
                <h4>Backplane Variable Supplies</h4>
            </div>
            <div id="variable-supply-container" class="flex-container">
                <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <td></td>
                            <th>Register</th>
                            <th>Resistance</th>
                        </tr>
                    </thead>
                    <tbody>



                        <tr>
                            <th class="text-right">AUXRESET</th>

            <td>
            <div class="input-group">
                <input class="form-control text-right" id="component-19-input" aria-label="Value" placeholder="111" type="text">
                <div class="input-group-btn">
                    <button class="btn btn-default" id="component-19-button" type="button">Set</button>
                </div>
            </div>
                    </td>
            <td>
            <div class="input-group">
                <input class="form-control text-right" id="component-20-input" aria-label="Value" placeholder="1.90" type="text">
                <span class="input-group-addon">V</span>
                <div class="input-group-btn">
                    <button class="btn btn-default" id="component-20-button" type="button">Set</button>
                </div>
            </div>
                    </td>
                        </tr>
                        <tr>
                            <th class="text-right">VCM</th>

            <td>
            <div class="input-group">
                <input class="form-control text-right" id="component-22-input" aria-label="Value" placeholder="50" type="text">
                <div class="input-group-btn">
                    <button class="btn btn-default" id="component-22-button" type="button">Set</button>
                </div>
            </div>
                    </td>
            <td>
            <div class="input-group">
                <input class="form-control text-right" id="component-23-input" aria-label="Value" placeholder="1.25" type="text">
                <span class="input-group-addon">V</span>
                <div class="input-group-btn">
                    <button class="btn btn-default" id="component-23-button" type="button">Set</button>
                </div>
            </div>
                    </td>
                        </tr>
                        <tr>
                            <th class="text-right">DACEXTREF</th>

            <td>
            <div class="input-group">
                <input class="form-control text-right" id="component-25-input" aria-label="Value" placeholder="21" type="text">
                <div class="input-group-btn">
                    <button class="btn btn-default" id="component-25-button" type="button">Set</button>
                </div>
            </div>
                    </td>
            <td>
            <div class="input-group">
                <input class="form-control text-right" id="component-26-input" aria-label="Value" placeholder="10.00" type="text">
                <span class="input-group-addon">uA</span>
                <div class="input-group-btn">
                    <button class="btn btn-default" id="component-26-button" type="button">Set</button>
                </div>
            </div>
                    </td>
                        </tr>
                        <tr>
                            <th class="text-right">VDD RST</th>

            <td>
            <div class="input-group">
                <input class="form-control text-right" id="component-28-input" aria-label="Value" placeholder="236" type="text">
                <div class="input-group-btn">
                    <button class="btn btn-default" id="component-28-button" type="button">Set</button>
                </div>
            </div>
                    </td>
            <td>
            <div class="input-group">
                <input class="form-control text-right" id="component-29-input" aria-label="Value" placeholder="3.30" type="text">
                <span class="input-group-addon">V</span>
                <div class="input-group-btn">
                    <button class="btn btn-default" id="component-29-button" type="button">Set</button>
                </div>
            </div>
                    </td>
                        </tr>
                        <tr>
                            <th class="text-right">VRESET</th>

            <td>
            <div class="input-group">
                <input class="form-control text-right" id="component-31-input" aria-label="Value" placeholder="45" type="text">
                <div class="input-group-btn">
                    <button class="btn btn-default" id="component-31-button" type="button">Set</button>
                </div>
            </div>
                    </td>
            <td>
            <div class="input-group">
                <input class="form-control text-right" id="component-32-input" aria-label="Value" placeholder="1.30" type="text">
                <span class="input-group-addon">V</span>
                <div class="input-group-btn">
                    <button class="btn btn-default" id="component-32-button" type="button">Set</button>
                </div>
            </div>
                    </td>
                        </tr>
                        <tr>
                            <th class="text-right">VCTRL</th>

            <td>
            <div class="input-group">
                <input class="form-control text-right" id="component-34-input" aria-label="Value" placeholder="100" type="text">
                <div class="input-group-btn">
                    <button class="btn btn-default" id="component-34-button" type="button">Set</button>
                </div>
            </div>
                    </td>
            <td>
            <div class="input-group">
                <input class="form-control text-right" id="component-35-input" aria-label="Value" placeholder="0.12" type="text">
                <span class="input-group-addon">V</span>
                <div class="input-group-btn">
                    <button class="btn btn-default" id="component-35-button" type="button">Set</button>
                </div>
            </div>
                    </td>
                        </tr>
                        <tr>
                            <th class="text-right">AUXSAMPLE</th>

            <td>
            <div class="input-group">
                <input class="form-control text-right" id="component-37-input" aria-label="Value" placeholder="36" type="text">
                <div class="input-group-btn">
                    <button class="btn btn-default" id="component-37-button" type="button">Set</button>
                </div>
            </div>
                    </td>
            <td>
            <div class="input-group">
                <input class="form-control text-right" id="component-38-input" aria-label="Value" placeholder="1.01" type="text">
                <span class="input-group-addon">V</span>
                <div class="input-group-btn">
                    <button class="btn btn-default" id="component-38-button" type="button">Set</button>
                </div>
            </div>
                    </td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>
        <div class="child">
            <div class="child-header">
                <div id="static-supply-collapse" class="collapse-button">
                    <div class="collapse-table">
                        <span id="static-supply-button-symbol" class="collapse-cell    glyphicon glyphicon-triangle-bottom"></span>
                    </div>
                </div>
                <h4>Backplane Static Supplies</h4>
            </div>
            <div id="static-supply-container" class="flex-container">
                <div class="table-container">
                <table>
    <thead>
        <tr>
            <td></td>
            <th>Current (mA)</th>
            <th>Voltage (V)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th class="text-right">VDDO</th>

<td>
<span id="component-44">21.49</span>
</td>
<td>
<span id="component-46">1.799</span>
</td>
        </tr>
        <tr>
            <th class="text-right">VDD D18</th>

<td>
<span id="component-49">79.37</span>
</td>
<td>
<span id="component-51">1.801</span>
</td>
        </tr>
        <tr>
            <th class="text-right">VDD D25</th>

<td>
<span id="component-54">56.17</span>
</td>

<td>
<span id="component-56">2.473</span>
</td>
        </tr>
        <tr>
            <th class="text-right">VDD P18</th>

<td>
<span id="component-59">23.20</span>
</td>
<td>
<span id="component-61">1.800</span>
</td>
        </tr>
        <tr>
            <th class="text-right">VDD A18_PLL</th>

<td>
<span id="component-64">12.21</span>
</td>
<td>
<span id="component-66">1.807</span>
</td>

        </tr>
        <tr>
            <th class="text-right">VDD D18ADC</th>

<td>
<span id="component-69">29.30</span>
</td>
<td>
<span id="component-71">1.801</span>
</td>
        </tr>
        <tr>
            <th class="text-right">VDD D18_PLL</th>

<td>
<span id="component-74">8.55</span>
</td>
<td>
<span id="component-76">1.802</span>
</td>
        </tr>
        <tr>
            <th class="text-right">VDD A33</th>

<td>
<span id="component-84">34.19</span>
</td>
<td>
<span id="component-86">3.308</span>
</td>
        </tr>
        <tr>
            <th class="text-right">VDD D33</th>

<td>
<span id="component-89">13.43</span>
</td>
<td>
<span id="component-91">3.303</span>
</td>
        </tr>
    </tbody>
</table>
</div>
            </div>
        </div>
    </div>
</div>
`;

       this.mount.appendChild(container);

       document.getElementById("ASIC-collapse").addEventListener("click", this.toggleCollapsed.bind(this, "ASIC"));
       document.getElementById("DAC-collapse").addEventListener("click", this.toggleCollapsed.bind(this, "DAC"));
       document.getElementById("variable-supply-collapse").addEventListener("click", this.toggleCollapsedSupply.bind(this));
       document.getElementById("static-supply-collapse").addEventListener("click", this.toggleCollapsedStaticSupply.bind(this));

       //Update navbar
       var list_elem = document.createElement("li");
       nav_list.appendChild(list_elem);
       var link = document.createElement("a");
       link.href = "#";
       list_elem.appendChild(link);
       var link_text = document.createTextNode("Configuration");
       link.appendChild(link_text);
       link.addEventListener("click", this.changePage.bind(this, "Configuration"));

        document.getElementById("configuration-page").classList.add("active");

        //Add Capture Page
        var container = document.createElement("div");
        container.id = "capture-page";
        container.classList.add("adapter-page");
        container.innerHTML = `
<div id="capture-container" class="flex-container">
<div class ="parent-column">
    <h4>Image Display</h4>
    <div class="vertical">
        <div id="image-container">
            <div>
                <canvas id="image-canvus" width="300" height="300" style = "border:1px solid #000000;"></canvas>
            </div>
            <div class="input-group-btn">
                <button id="display-single-button" class="btn btn-default" type="button">Single Frame</button>
                <button id="display-continuous-button" class="btn btn-default" type="button">Continuous</button>
            </div>
        </div>
    </div>
</div>
<div class ="child-column">
    <div class="child">
        <div class="child-header">
            <div id="capture-collapse" class="collapse-button">
                <div class="collapse-table">
                    <span id="capture-button-symbol" class="collapse-cell    glyphicon glyphicon-triangle-bottom"></span>
                </div>
            </div>
            <h4>Image Capture Run</h4>
        </div>
        <div id="capture-container">
        <div class="flex-container">
            <h5>Logging File:</h5>
            <div class="input-group" title="File location for storing the image logs">
                <input id="capture-logging-input" class="form-control text-right"  placeholder=" " type="text">
            </div>
            <div class="input-group-btn">
                <button id="capture-logging-browse-btn" class="btn btn-default" type="button">Browse</button>
            </div>
        </div>
        <div class="flex-container">
            <h5>Frame Number:</h5>
            <div class="input-group" title=" ">
                <input id="capture-frame-number-input" class="form-control text-right"  placeholder=" " type="text">
            </div>
        </div>
        <div class="flex-container">
            <h5>Frame Delay:</h5>
            <div class="input-group" title=" ">
                <input id="capture-frame-delay-input" class="form-control text-right"  placeholder=" " type="text">
            </div>
        </div>
        <div class="input-group-btn">
            <button id="display-run-button" class="btn btn-default" type="button">Display Capture Run</button>
            <button id="log-run-button" class="btn btn-default" type="button">Log Capture Run</button>
        </div>
        </div>
    </div>
    <div class="child">
        <div class="child-header">
            <div id="calibration-collapse" class="collapse-button">
                <div class="collapse-table">
                    <span id="calibration-button-symbol" class="collapse-cell    glyphicon glyphicon-triangle-bottom"></span>
                </div>
            </div>
            <h4>ASIC Calibration Run</h4>
        </div>
        <div id="calibration-container">
        <div class="flex-container">
            <h5>Logging File:</h5>
            <div class="input-group" title="File location for storing the caibration image logs">
                <input id="calibration-logging-input" class="form-control text-right"  placeholder=" " type="text">
            </div>
            <div class="input-group-btn">
                <button id="calibration-logging-browse-btn" class="btn btn-default" type="button">Browse</button>
            </div>
        </div>
        <div class="flex-container">
            <h5>AUXSAMPLE Start(V):</h5>
            <div class="input-group" title=" ">
                <input id="configure-input-start" min="0" max="3.3" class="form-control text-right" aria-label="Start" placeholder="0" type="number" step="0.01">
            </div>
        </div>
        <div class="flex-container">
            <h5>AUXSAMPLE Step(V):</h5>
            <div class="input-group" title=" ">
                <input id="configure-input-step" min="0" max="3.3" class="form-control text-right" aria-label="Step" placeholder="0.1" type="number" step="0.01">
            </div>
        </div>
        <div class="flex-container">
            <h5>AUXSAMPLE Finish(V):</h5>
            <div class="input-group" title=" ">
                <input id="configure-input-finish" min="0" max="3.3" class="form-control text-right" aria-label="Finish" placeholder="1" type="number" step="0.01">
            </div>
        </div>
        <div class="input-group-btn">
            <button id="calibration-run-button" class="btn btn-default" type="button">Perform Calibration Run</button>
        </div>
        </div>
    </div>
</div>
</div>
`;

       this.mount.appendChild(container);

       //Update navbar
       var list_elem = document.createElement("li");
       nav_list.appendChild(list_elem);
       var link = document.createElement("a");
       link.href = "#";
       list_elem.appendChild(link);
       var link_text = document.createTextNode("Image Capture");
       link.appendChild(link_text);
       link.addEventListener("click", this.changePage.bind(this, "Capture"));

        //Add footer
        var footer = document.createElement("div");
        footer.classList.add("footer");
        footer.innerHTML = `
<p>
    Odin server: <a href="www.github.com/odin-detector/odin-control">www.github.com/odin-detector/odin-control</a>
</p>
<p>
    API Version: ${api_version}
</p>`;
        this.mount.appendChild(footer);

        if(this.getCookie("dark") === "true")
            this.toggleDark();
    };


//Handles onClick events from the navbar

App.prototype.changePage =
    function(page)
    {
        if(page=="Configuration") {
            document.getElementById("configuration-page").classList.add("active");
            document.getElementById("capture-page").classList.remove("active");
        } else {
            document.getElementById("configuration-page").classList.remove("active");
            document.getElementById("capture-page").classList.add("active");
        }
    };

App.prototype.toggleCollapsed(section) =
    function()
    {
        document.getElementById(section + "-container").classList.toggle("collapsed");
        document.getElementById(section + "-button-symbol").classList.toggle("glyphicon-triangle-right");
        document.getElementById(section + "-button-symbol").classList.toggle("glyphicon-triangle-bottom");
    };

App.prototype.toggleCollapsedSupply =
    function()
    {
        document.getElementById("variable-supply-container").classList.toggle("collapsed");
        document.getElementById("variable-supply-button-symbol").classList.toggle("glyphicon-triangle-right");
        document.getElementById("variable-supply-button-symbol").classList.toggle("glyphicon-triangle-bottom");
    };

    App.prototype.toggleCollapsedStaticSupply =
        function()
        {
            document.getElementById("static-supply-container").classList.toggle("collapsed");
            document.getElementById("static-supply-button-symbol").classList.toggle("glyphicon-triangle-right");
            document.getElementById("static-supply-button-symbol").classList.toggle("glyphicon-triangle-bottom");
        };

App.prototype.setError =
    function(data)
    {
        if(data.hasOwnProperty("json"))
        {
            var json = data.responseJSON;
            if(json.hasOwnProperty("error"))
                this.showError(json.error);
        }
        else
        {
            this.showError(data.responseText);
        }
    }

App.prototype.showError =
    function(msg)
    {
        if(this.error_timeout !== null) clearTimeout(this.error_timeout);
        this.error_message.nodeValue = `Error: ${msg}`;
        this.error_timeout = setTimeout(this.clearError.bind(this), 5000);
    }

App.prototype.clearError =
    function()
    {
        this.error_message.nodeValue = "";
    };


App.prototype.toggleDark =
    function()
    {
        this.dark_mode = !this.dark_mode;
        this.setCookie("dark", this.dark_mode.toString());

        this.mount.classList.toggle("dark");
        this.documentBody.classList.toggle("background-dark");
    };

App.prototype.getCookie =
    function(key)
    {
        var raw = document.cookie.split(';');
        for(var value of raw)
        {
            if(value.indexOf(key) == 0)
                return decodeURIComponent(value.substring(key.length + 1));
        }
    };

App.prototype.setCookie =
    function(key, value)
    {
        var date = new Date();
        date.setTime(date.getTime() + 30 * (24 * 60 * 60 * 1000));
        var expires = `expires=${date.toUTCString()}`;

        var raw = document.cookie.split(';');
        raw = raw.filter((itm) => itm.indexOf("path") !== 0
                                && itm.indexOf("expires") !== 0
                                && itm.length > 0);
        var cookieString = `${key}=${encodeURIComponent(value)}`;
        var found = false;
        for(var i = 0; i < raw.length; i++)
            if(raw[i].indexOf(key) === 0)
            {
                raw[i] = cookieString;
                found = true;
            }
        if(!found)
            raw.push(cookieString);
        var s = `${raw.join(';')};${expires};path=/`;
        document.cookie = `${raw.join(';')};${expires};path=/`;
    };

//Create the App() instance
function initApp()
{
    var app = new App();
}