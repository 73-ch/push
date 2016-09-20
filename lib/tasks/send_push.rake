require "jwt"
require 'net/http'
require "base64"
require 'openssl'

namespace :push do
	desc ""
	task :send => :environment do
		pushes = Push.where("send_time >= ?", DateTime.now - 24.hours)
		pushes.each do |push|
			jwt_bn = OpenSSL::BN.new(Base64.urlsafe_decode64(push.jwt), 2)
			jwt_key = OpenSSL::PKey::EC.new("prime256v1")
			puts Time.now.to_f / 1000.floor + 86400
			jwt_key.private_key = jwt_bn
			payload = {
				aud: "https://fcm.googleapis.com",
				exp: Time.now.to_f.floor + 86400,
			}
			token = JWT.encode(payload, jwt_key, 'ES256')
			uri = URI.parse("https://fcm.googleapis.com/fcm/send/#{push.end_point}")
	    http = Net::HTTP.new(uri.host, uri.port)
	    encrypted_data = Base64.urlsafe_decode64(push.encryption_data)

	    http.use_ssl = true
	    request = Net::HTTP::Post.new(uri.request_uri)

	    request["Content-Length"] = encrypted_data.length.to_s
	    request["Authorization"] = 'WebPush ' + token
	    request["Content-Type"] = "application/octet-stream"
	    request["Encryption"] = push.salt
	    request["Content-Encoding"] = "aesgcm"
	    request["Crypto-Key"] = push.crypto_key
	    request["TTL"] = "60000"
			request.body = encrypted_data
			puts request["Content-Length"]


			response = http.request(request)
			if response.code == "201"
				push.destroy
			end
		end
	end
end