> Small utility to add a floating table of contents a la _Dropbox Paper_

<br>
<p align="center">
    <img src="https://github.com/teesloane/ootliner/blob/master/example/ootliner_screen.gif?raw=true"/>
</p>
<br>

## To add `Ootliner` to your page...

### If you use a module bundler

install _Ootliner_ with npm: 

``` sh
npm install --save ootliner
```

Then import the module, below is an example of using ootliner in a gatsby blog.

``` javascript
import ootliner from 'ootliner'

class BlogPostTemplate extends React.Component {
  componentDidMount() {
    ootliner()
  }
  
// ...
```

### Just drop in the script (not using module bundler)

``` html
<script src="https://unpkg.com/ootliner@0.0.2/lib/index.js "></script>
<script> ootliner()</script>
```

## Development

``` sh
git clone https://github.com/teesloane/ootliner.git
cd ootliner
npm install
npm run dev
# Open ./example/index.html to view Ootliner in use.
```

