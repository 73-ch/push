class CreatePlans < ActiveRecord::Migration
  def change
    create_table :plans do |t|

    	t.string :title
    	t.text :content

    	t.datetime :time

    	t.string :content_length
    	t.string :crypto_key
    	t.string :encryption
    	t.string :title
    	t.text :encrypted_data

      t.timestamps null: false
    end
  end
end
