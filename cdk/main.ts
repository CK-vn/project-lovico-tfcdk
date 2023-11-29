import { Construct } from "constructs";
import { App, TerraformStack, RemoteBackend } from "cdktf";
import { DockerProvider } from "@cdktf/provider-docker/lib/provider";
import { Image } from "@cdktf/provider-docker/lib/image";
import { Container } from "@cdktf/provider-docker/lib/container";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new RemoteBackend(this, {
      organization: "delivery_admin_vn",

      workspaces: {
        name: "tfcdk",
      },
    });

    new DockerProvider(this, "docker", {});

    const dockerImage = new Image(this, "nginxImage", {
      name: "nginx:latest",
      keepLocally: false,
    });

    new Container(this, "nginxContainer", {
      name: "tutorial",
      // https://developer.hashicorp.com/terraform/tutorials/cdktf/cdktf-install
      // https://github.com/hashicorp/terraform
      image: dockerImage.name,
      // image: dockerImage.imageId, <--- :D
      ports: [
        {
          internal: 80,
          external: 8000,
        },
      ],
    });
  }
}

const app = new App();
new MyStack(app, "learn-cdktf-docker");
app.synth();
