import React, { Component } from 'react';
import { render } from 'react-dom';
import $ from "jquery";
import _ from "lodash";
import './index.css';


class Wikipedia extends Component {
  constructor() {
    super();
    this.state = { 
      term: "",
      data: []      
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.renderData = this.renderData.bind(this);    
  }
  renderData(item, i) {
    const { url, title, extract } = item;      

    return (
          <li key={i} className="list-group-item">            
            <a href={url}>              
              <h1>{title}</h1>
              <p>{extract}</p>
            </a>       
           </li>
        );

  }  
  onInputChange(e) {
    this.setState({
      term: e.target.value
    })
    
  }
  onFormSubmit(e) {
    e.preventDefault();   
    let api = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
    let cb = '&callback=JSON_CALLBACK';
    let page = 'https://en.wikipedia.org/?curid=';  	
    
    $.ajax({
    type: "GET",
    url: `${api}${this.state.term}${cb}`,
    dataType: "jsonp",
    success: (data) => {
      let results = data.query.pages;
      
      _.map(results, item => {        
        let object = Object.assign({}, {
          url: `${page}${item.pageid}`,
          title: item.title,
          extract: item.extract           
        })
        this.setState({
          data: this.state.data.concat(object),
          term: ""		               
        }) 
      });   
           
    },
      error: (xhr, ajaxOptions, thrownError) => {
        alert(xhr.status);
        alert(thrownError);
      }
    })	   
  }
  
  render() {
    let { data } = this.state;
              

    return (
      <div>
        <h1 className="text-primary text-center">Wikipedia Viewer</h1>
        <form onSubmit={this.onFormSubmit} className="search-form">          
          <div className="form-group has-feedback">
            <input value={this.state.term} onChange={this.onInputChange} placeholder="search" className="form-control" />
            <span className="glyphicon glyphicon-search form-control-feedback"></span>
            <button type="submit" className="btn btn-primary submit-button">Submit</button>
            <a href="https://en.wikipedia.org/wiki/Special:Random" className="btn btn-primary random-link">Random</a>              
          </div>
        </form>
          <ul className="list-group">
            {data.map(this.renderData)}
          </ul>   
      </div>  
    );
  }
}

render(
  <Wikipedia />,
  document.getElementById('root')
);
