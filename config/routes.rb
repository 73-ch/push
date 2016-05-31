Rails.application.routes.draw do
	root "push#index"
  get '/index' => "push#index"
  get '/push' => "push#push", defaults: {format: "js"}
  get '/push2' => "push#push2", defaults: {format: "js"}
  get '/manifest' => 'push#manifest', defaults: {format: "json"}
  get "/new" => "push#new"

  post '/create' => "push#create"
 	post "/push_data" => "push#push_data"
 	post "/push_data2" => "push#push_data2"

 	get "/action1" => "push#action1"
 	get "/action2" => "push#action2"
end
