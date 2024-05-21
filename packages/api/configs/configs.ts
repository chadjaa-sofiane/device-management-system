interface Config {
  env: string;
  port: number | string;
  hostname: string;
  database: {
    url: string;
    db_name: string;
  };
}

const commonConfigs = {
  port: process.env.PORT || 3000,
  hostname: process.env.HOSTNAME || "localhost",
};

const developmentConfigs = {
  ...commonConfigs,
  env: "development",
  database: {
    url:
      process.env.MONGODB_DEVELOPEMENT_URI ||
      "mongodb://localhost:27017/development",
    db_name: "development",
  },
};

const productionConfigs = {
  ...commonConfigs,
  env: "production",
  database: {
    url: process.env.MONGODB_PRODUCTION_URI || "",
    db_name: "production",
  },
};

const testConfigs = {
  ...commonConfigs,
  env: "test",
  database: {
    url: process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/test",
    db_name: "test",
  },
};

const APP_ENV = process.env.NODE_ENV as "development" | "production" | "test";

const configs: Record<typeof APP_ENV, Config> = {
  development: developmentConfigs,
  production: productionConfigs,
  test: testConfigs,
};

export default configs[APP_ENV];
