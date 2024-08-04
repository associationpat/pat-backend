import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

export default function swagger(app){

    const options = new DocumentBuilder()
        .setTitle('PAT API')
        .setDescription(
            'This is the API for the PAT project (website for clients and admin dashboard)',
        )
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
        )
        //.addTag('PAT')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
}