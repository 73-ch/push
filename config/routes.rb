Rails.application.routes.draw do
	root "push#index"
  get '/index' => "push#index"
  get '/push' => "push#push", defaults: {format: "js"}
  get "/new" => "push#new"

  post '/pushes' => "push#create"
 	post "/push_data" => "push#push_data"

 	get "/action1" => "push#action1"
 	get "/action2" => "push#action2"
end
