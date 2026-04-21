class FrontendController < ApplicationController
  def index
    render inline: <<~HTML, layout: false
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Salary Management</title>
          <%= vite_client_tag %>
          <%= vite_react_refresh_tag %>
          <%= vite_javascript_tag 'main.jsx' %>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    HTML
  end
end