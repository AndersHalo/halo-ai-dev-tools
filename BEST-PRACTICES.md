# General Best Practices

- Usually agents create extensive files. To avoid overload context, create files under 500 lines; 300–350 is optimal.

- Avoid ambiguities (A or B). Give the agent clear instructions; write concrete, clear specifications so the agent understands. Be as clear and precise as possible; avoid long explanations.

- Make sure there are no inconsistencies and no gaps. Implement the scheduling feature (scheduling is not part of the MVP).

- Always review each file in detail and identify gaps, ambiguities, and inconsistencies. If you detect any, correct them. LLM hallucinations sometimes generate incorrect information; review and correct it.

---

# Agentic Coding

## Project Rules

Depending on the agent you need to define the following elements:

### Claude

- Use **skills** for executable commands that AI and other team members can follow. If they look more like rules, send them to `claude.md` files.

- **Claude.md file**
  1. It is always loaded in Claude context, so it is essential to define:
     - scripts and commands necessary for the app to work
     - Custom workflows (testing, deploy, commits)
     - Project architecture: state management, folder structure, dependencies
     - Critical rules
     - Environment setup
  2. Avoid defining common patterns (framework/library patterns). Usually the LLM can infer those. Use this file to set enterprise-critical and workflow rules.

## Project Planning

Don’t do live coding. Instead, create a defined plan. Use the tool that you consider best; just make sure the plan has:

- A purpose
- A task list
- Unit testing

Make sure your plan follows the general best practices so you can review it.

---

# It’s a Must

- **Verify/review a plan before implementing.**
- Once your plan was implemented, review the generated code and test it yourself: do a smoke test and run the test command.
