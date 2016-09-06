require "jwt"
require "base64"
require 'openssl'

namespace :push do
	desc ""
	task :send => :environment do
		pushes = Push.where("send_time <= ?", DateTime.now)
		puts DateTime.now
		pushes.each do |push|
			jwt_bn = Base64.urlsafe_decode64(push.jwt)
			jwt_group = OpenSSL::PKey::EC::Group.new("prime256v1")
			jwt_key = OpenSSL::PKey::EC.new(OpenSSL::ASN1.decode(push.jwt))
			payload = {
				aud: push.end_point,
				exp: 1464269795,
				sub: "https://labs.othersight.jp/webpushtest/"
			}
			token = JWT.encode(payload, jwt_key, 'ES256')
			uri = URI.parse("https://gcm-http.googleapis.com/gcm/#{push.end_point}")
	    http = Net::HTTP.new(uri.host, uri.port)
	    encrypted_data = Base64.urlsafe_decode64(push.encryption_data)

	    http.use_ssl = true
	    request = Net::HTTP::Post.new(uri.request_uri)

	    request["Content-Length"] = encrypted_data.length.to_s
	    request["Authorization"] = "Bearer #{token}"
	    request["Content-Type"] = "application/octet-stream"
	    request["Crypto-Key"] = push.crypto_key
	    request["Encryption"] = push.salt
	    request["Content-Encoding"] = "aesgcm"
	    request["TTL"] = "60000"
			request.body = encrypted_data


			response = http.request(request)
			push.destroy
		end
	end
end