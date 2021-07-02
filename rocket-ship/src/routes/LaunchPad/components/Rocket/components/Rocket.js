import React, { useState, PureComponent } from "react";
import RocketCore from "./RocketCore";

export const FunctionalRocket = React.memo(function FunctionalRocket() {
  const [initialLaunchTime] = useState(Date.now());

  return <RocketCore initialLaunchTime={initialLaunchTime} />;
});

export class ClassRocket extends PureComponent {
  constructor() {
    super();

    this.state = {
      initialLaunchTime: Date.now(),
    };
  }

  render() {
    const { initialLaunchTime } = this.state;

    return <RocketCore initialLaunchTime={initialLaunchTime} />;
  }
}
