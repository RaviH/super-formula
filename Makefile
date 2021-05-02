deploy: build
	sam deploy -g

zip:
	cd service; rm -rf build; yarn build; cd build; zip -rD dist-latest.zip .

zip-js:
	zip -rD dist-latest.zip src

s3: zip
	aws s3 cp service/build/dist-latest.zip s3://ravi-sam-template/dist-latest.zip

get_url:
	aws cloudformation describe-stacks \
		--stack-name=sam-app \
    	--query "Stacks[0].Outputs[?OutputKey=='HelloWorldApi'].OutputValue" \
    	--output text

build: s3
	sam build
