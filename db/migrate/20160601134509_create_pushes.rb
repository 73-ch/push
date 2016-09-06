class CreatePushes < ActiveRecord::Migration
  def change
    create_table :pushes do |t|
      t.string :jwt
    	t.string :crypto_key
    	t.string :encryption_data
      t.string :end_point
      t.string :salt

    	t.datetime :send_time


	    t.timestamps null: false
    end
  end
end
