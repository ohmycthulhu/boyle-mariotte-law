<h3>Boyle-Mariotte Law model</h3>
<p>
    This repository contains code that was used for modeling Boyle-Mariotte Law.
    The model itself is written in R language, source code is located in src/run.R  
</p>
<p>
   Interface for comfortable work with model is written in HTML5/CSS/JS as front-end and PHP as backend.
   Used 
</p>
<div>
To run project:
<ul>
<li>Install dependencies from package.json with <code>npm install</code></li>
<li>Copy everything from <i>src</i> folder into HTTP serving folder (e.g. htdocs for XAMPP) </li>
<li>Or just run <code>php -S 0.0.0.0:80 -t ./src</code> for serving with PHP server</li>
</ul>
</div>
<div>
Example plots can be found in examples/
</div>
<div>
<h4>
    Generated plots
</h4>
<div>
    Each run of model generates 3 plots:
    <ol>
        <li><strong>temperature.png</strong> - shows temperature distribution for the model</li>
        <li><strong>initial.png</strong> - shows how all atoms were located at the beginning of modelling</li>
        <li><strong>results.png</strong> - shows the position of atoms at the end of modelling.
        Points' collision counts are showed with color:
            <ul>
                <li><i>Black</i> - 0</li>
                <li><i>Red</i> - 1</li>
                <li><i>Blue</i> - 2 or more</li>
            </ul>
        </li>
    </ol>
</div>
</div>
<div>
<h4>
    Description of model
</h4>
<p>
    To model Boyle-Mariotte Law, <strong>pV=const</strong> we should build ideal gas model with chaotic movement.
    While atoms move, there are collisions between atoms and between atoms and walls.
    Collisions between atoms are ignored. Collisions between atoms and the walls are considered as pressure.
    The movements speed (v) depends on square root of temperature. Temperature is distributed by Gauss Law.
</p>
<p>
    Model follows the next algorithm:
</p>
<ol>
<li><i>N</i> atoms are generated with random speed. Speed is distributed by Gauss Law</li>
<li>Atoms new position (after Δt seconds) are calculated</li>
<li>Program selects atoms, which new position is outside of current box</li>
<li> For each outside atom, the following algorithm is executed:
<ul>
    <li>Program calculates the time, when atom leaves box</li>
    <li>Atom's track is calculated until that moment, then the needed speed vector (e.g. Vx) is multiplied by -1</li>
    <li>New position of atom is computed.</li>
    <li>The following steps are repeated until atom's new position is not located inside box</li>
</ul>
</li>
<li>Program calculates the count of collisions between atoms and the walls, and it is the pressure</li>
</ol>
</div>